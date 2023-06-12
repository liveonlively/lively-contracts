// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { LibDiamond } from "../shared/libraries/LibDiamond.sol";
import { IDiamondCut } from "../shared/interfaces/IDiamondCut.sol";
import { IDiamondLoupe } from "../shared/interfaces/IDiamondLoupe.sol";
import { Shared } from "./libraries/Shared.sol";
import { IERC173 } from "@solidstate/contracts/interfaces/IERC173.sol";
import { IERC165 } from "@solidstate/contracts/interfaces/IERC165.sol";
import { IERC721 } from "@solidstate/contracts/interfaces/IERC721.sol";
import { IERC2981 } from "@solidstate/contracts/interfaces/IERC2981.sol";
import { IERC721Metadata } from "@solidstate/contracts/token/ERC721/metadata/IERC721Metadata.sol";
import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";
import { LibDiamondEtherscan } from "../shared/libraries/LibDiamondEtherscan.sol";
import { ILivelyDiamond } from "./interfaces/ILivelyDiamond.sol";
import { OwnableStorage, OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { RoyaltiesStorage } from "../shared/utils/Royalties/RoyaltiesStorage.sol";
import { ERC2981Storage } from "@solidstate/contracts/token/common/ERC2981/ERC2981Storage.sol";
import { ERC721AStorage } from "./utils/ERC721A/ERC721AStorage.sol";
import { EditionsStorage, Edition } from "./utils/Editions/EditionsStorage.sol";
import { PaymentSplitterStorage } from "../shared/utils/PaymentSplitter/PaymentSplitterStorage.sol";
import { AllowListStorage } from "../shared/utils/AllowList/AllowListStorage.sol";

/// @custom:security-contact support@golive.ly
contract LivelyDiamond is ILivelyDiamond {
    string private constant CONTRACT_VERSION = "0.0.1";

    struct DiamondArgs {
        uint256 _price;
        uint256 _maxSupply;
        uint256 _maxMintPerTx;
        uint256 _maxMintPerAddress;
        address _secondaryPayee;
        address _owner;
        uint16 _secondaryPoints;
        address[] _payees; // primary
        uint256[] _shares; // primary
        string _name;
        string _symbol;
        string _contractURI;
        string _baseTokenUri;
        bool _airdrop;
        bool _allowListEnabled;
        bool _isPriceUSD;
        bool _automaticUSDConversion;
        bool _isSoulbound;
        Edition[] _editions;
    }

    constructor(IDiamondCut.FacetCut[] memory _diamondCut, DiamondArgs memory _args) payable {
        uint256 payeesLength;
        uint256 sharesLength = _args._shares.length;
        if (!_args._airdrop) {
            payeesLength = _args._payees.length;
            if (payeesLength != sharesLength) {
                revert PaymentSplitterMismatch();
            }

            if (payeesLength == 0) {
                revert PaymentSplitterNoPayees();
            }
        }

        LibDiamond.diamondCut(_diamondCut, address(0), new bytes(0));
        OwnableStorage.layout().owner = msg.sender;

        // adding ERC165 data
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
        ds.supportedInterfaces[type(IERC721).interfaceId] = true;
        ds.supportedInterfaces[type(IERC721Metadata).interfaceId] = true;
        ds.supportedInterfaces[type(IAccessControl).interfaceId] = true;
        ds.supportedInterfaces[type(IERC2981).interfaceId] = true;

        AllowListStorage.Layout storage als = AllowListStorage.layout();
        EditionsStorage.Layout storage es = EditionsStorage.layout();
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        // Initialize Data
        // s.paused = false; // Defaults to false
        // s.currentIndex = 0; // Defaults to 0
        s.name = _args._name;
        s.symbol = _args._symbol;
        s.airdrop = _args._airdrop;
        s.maxSupply = _args._maxSupply;
        pss.isPriceUSD = _args._isPriceUSD;
        s.isSoulbound = _args._isSoulbound;
        RoyaltiesStorage.layout().contractURI = _args._contractURI;
        s.maxMintPerTx = _args._maxMintPerTx;
        s.baseTokenUri = _args._baseTokenUri;
        s.price = _args._airdrop ? 0 : _args._price;
        als.allowListEnabled[0] = _args._allowListEnabled;
        s.maxMintPerAddress = _args._maxMintPerAddress;
        pss.automaticUSDConversion = _args._automaticUSDConversion;

        // Initialize PaymentSplitter information
        for (uint256 i = 0; i < sharesLength; ) {
            Shared._addPayee(_args._payees[i], _args._shares[i]);
            // Gas Optimization
            unchecked {
                ++i;
            }
        }

        // Set 2981 Royalty Info (Secondary Royalties)
        ERC2981Storage.Layout storage rs = ERC2981Storage.layout();
        rs.defaultRoyaltyBPS = _args._secondaryPoints;
        rs.defaultRoyaltyReceiver = _args._secondaryPayee;

        // TODO: Access Controls need revamping
        // // Access Control Roles
        // s.DEFAULT_ADMIN_ROLE = 0x00;
        // s.OWNER_ROLE = keccak256("OWNER_ROLE");

        // Shared._grantRole(s.DEFAULT_ADMIN_ROLE, msg.sender);
        // Shared._grantRole(s.OWNER_ROLE, msg.sender);

        // Editions
        uint256 editionsLength = _args._editions.length;
        if (editionsLength > 0) {
            es.editionsEnabled = true;
            for (uint256 i = 0; i < editionsLength; ) {
                Edition memory _edition = _args._editions[i];

                Shared.createEdition(_edition.name, _edition.maxSupply, _edition.price);

                unchecked {
                    ++i;
                }
            }
        }

        // Set implementation slot
        LibDiamondEtherscan._setDummyImplementation(0xb0591Ec0b42eCBB6d5AA641Af4d87913b57f23D6);
    }

    // Find facet for function that is called and execute the
    // function if a facet is found and return any value.
    fallback() external payable {
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        address facet = address(bytes20(ds.facets[msg.sig]));
        require(facet != address(0), "Diamond: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        assembly {
            // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // get any return value
            returndatacopy(0, 0, returndatasize())
            // return any return value or error back to the caller
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {
        emit Shared.PaymentReceived(msg.sender, msg.value);
    }
}
