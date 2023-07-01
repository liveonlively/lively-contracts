export const optimizationEnabled = <const>[
  "contracts/ERC721-Diamond/LivelyDiamond.sol",
  "contracts/ERC721-Diamond/CLIENT_TEMPLATE_DIAMOND.sol",
  "contracts/ERC721-Diamond/utils/Editions/EditionsStorage.sol",
  "contracts/ERC721-Diamond/utils/ERC721A/ERC721AStorage.sol",
  "contracts/ERC721-Diamond/upgradeInitializers/DiamondInit.sol",
  "contracts/ERC721-Diamond/libraries/Shared.sol",
  "contracts/ERC721-Diamond/libraries/ERC721ALib.sol",
  "contracts/ERC721-Diamond/interfaces/IQueryableFacet.sol",
  "contracts/ERC721-Diamond/interfaces/ILivelyDiamond.sol",
  "contracts/ERC721-Diamond/interfaces/IERC721AQueryable.sol",
  "contracts/ERC721-Diamond/interfaces/IERC721A.sol",
  "contracts/ERC721-Diamond/facets/QueryableFacet.sol",
  "contracts/ERC721-Diamond/facets/EditionsFacet.sol",
  "contracts/ERC721-Diamond/facets/ERC721AFacet.sol",
  "contracts/ERC721-Diamond/abstracts/ERC721AQueryable.sol",
  "contracts/ERC721-Diamond/abstracts/ERC721A.sol",
  "contracts/ERC1155-Diamond/Lively1155Diamond.sol",
  "contracts/ERC1155-Diamond/CLIENT_TEMPLATE_DIAMOND.sol",
  "contracts/ERC1155-Diamond/utils/Metadata/MetadataStorage.sol",
  "contracts/ERC1155-Diamond/utils/Metadata/MetadataInternal.sol",
  "contracts/ERC1155-Diamond/utils/ERC1155/ERC1155Storage.sol",
  "contracts/ERC1155-Diamond/upgradeInitializers/Diamond1155Init.sol",
  "contracts/ERC1155-Diamond/libraries/TokenMetadata.sol",
  "contracts/ERC1155-Diamond/libraries/MerkleTreeLib.sol",
  "contracts/ERC1155-Diamond/libraries/ERC1155Lib.sol",
  "contracts/ERC1155-Diamond/libraries/AllowListLib.sol",
  "contracts/ERC1155-Diamond/interfaces/IERC1155Facet.sol",
  "contracts/ERC1155-Diamond/facets/PackFacet.sol",
  "contracts/ERC1155-Diamond/facets/ERC1155Facet.sol",
  "contracts/ERC1155-Diamond/facets/CrossmintFacet.sol",
  "contracts/ERC1155-Diamond/abstracts/ERC1155.sol",
  "contracts/shared/utils/Royalties/RoyaltiesStorage.sol",
  "contracts/shared/utils/PaymentSplitter/PaymentSplitterStorage.sol",
  "contracts/shared/utils/PaymentSplitter/PaymentSplitterInternal.sol",
  "contracts/shared/utils/PaymentSplitter/PaymentSplitter.sol",
  "contracts/shared/utils/PaymentSplitter/IPaymentSplitterInternal.sol",
  "contracts/shared/utils/AllowList/IAllowListInternal.sol",
  "contracts/shared/utils/AllowList/IAllowList.sol",
  "contracts/shared/utils/AllowList/AllowListStorage.sol",
  "contracts/shared/utils/AllowList/AllowListInternal.sol",
  "contracts/shared/utils/AllowList/AllowList.sol",
  "contracts/shared/mocks/USDCMock.sol",
  "contracts/shared/mocks/PriceMock.sol",
  "contracts/shared/libraries/PriceConsumer.sol",
  "contracts/shared/libraries/LibDiamondEtherscan.sol",
  "contracts/shared/libraries/LibDiamond.sol",
  "contracts/shared/libraries/CoinSwapper.sol",
  "contracts/shared/libraries/ArrayUtils.sol",
  "contracts/shared/interfaces/IWETH9.sol",
  "contracts/shared/interfaces/IDiamondLoupe.sol",
  "contracts/shared/interfaces/IDiamondCut.sol",
  "contracts/shared/facets/RoyaltyFacet.sol",
  "contracts/shared/facets/PaymentSplitterFacet.sol",
  "contracts/shared/facets/PausableFacet.sol",
  "contracts/shared/facets/OwnableFacet.sol",
  "contracts/shared/facets/DiamondLoupeFacet.sol",
  "contracts/shared/facets/DiamondEtherscanFacet.sol",
  "contracts/shared/facets/DiamondCutFacet.sol",
  "contracts/shared/facets/AllowListFacet.sol",
];

  export const erc721Facets = optimizationEnabled
    .filter((path) => path.startsWith("contracts/ERC721-Diamond/facets/"))
    .map((path) => path.replace("contracts/ERC721-Diamond/facets/", ""))
    .concat(["DummyDiamond721Implementation.sol"]);

  export const erc1155Facets = optimizationEnabled
    .filter((path) => path.startsWith("contracts/ERC1155-Diamond/facets/"))
    .map((path) => path.replace("contracts/ERC1155-Diamond/facets/", ""))
    .concat(["DummyDiamond1155Implementation.sol"]);

  export const sharedFacets = optimizationEnabled
    .filter((path) => path.startsWith("contracts/shared/facets/"))
    .map((path) => path.replace("contracts/shared/facets/", ""));

  