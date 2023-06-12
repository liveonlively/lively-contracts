import { expect } from "chai";
import { ethers } from "hardhat";
import { HDNodeWallet } from "ethers";
import { valueToEther } from "../shared";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deploy, defaultArgs } from "../../scripts/deployDiamondVerify";

describe(`DiamondQueryable Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs

    const defaultPrice = valueToEther("0");
    const edition1MaxSupply = 0;
    const edition1Price = 0;
    const edition2MaxSupply = 0;
    const edition2Price = 0;

    defaultArgs._price = defaultPrice;
    defaultArgs._baseTokenUri = "https://golive.ly/tokenuri/";
    defaultArgs._secondaryPayee = addr2.address;
    defaultArgs._airdrop = false;
    defaultArgs._isPriceUSD = false;
    defaultArgs._automaticUSDConversion = false;
    defaultArgs._editions = [];
    defaultArgs._isSoulbound = false;
    defaultArgs._editions = [
      {
        name: "Test Edition 1",
        maxSupply: edition1MaxSupply,
        totalSupply: 0,
        price: edition1Price,
      },
      {
        name: "Test Edition 2",
        maxSupply: edition2MaxSupply,
        totalSupply: 0,
        price: edition2Price,
      },
    ];

    const contractAddress = await deploy(defaultArgs, { verify: false });
    const contract = await ethers.getContractAt("DummyDiamond721Implementation", contractAddress, owner);

    const maxSupply = await contract["maxSupply()"]();

    return {
      owner,
      addr1,
      addr2,
      contract,
      maxSupply,
      edition1Price,
      edition2Price,
    };
  }

  describe("Should get owners of regardless of edition", function () {
    it("Should mint and get correct queries", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](owner.address, 3, 1, {
        value: 0,
      });

      const owners = await contract["getOwners()"]();

      expect(owners.includes(addr1.address)).to.be.true;
      expect(owners.includes(owner.address)).to.be.true;
    });

    it("Should be query large nunber of owners", async () => {
      const { contract } = await loadFixture(deployTokenFixture);

      const ownerWallets: HDNodeWallet[] = [];
      const amountOfWallets = 100; // Starts failing around 7000 wallets (10.5k mints)
      const mintingPromises = [];

      for (let i = 0; i < amountOfWallets; i++) {
        const wallet = ethers.Wallet.createRandom();
        ownerWallets.push(wallet);

        // Half mint 0, half mint 1
        const editionIndex = i % 2;

        mintingPromises.push(
          contract["mint(address,uint256,uint256)"](
            ownerWallets[i].address,
            editionIndex + 1, // Mint 2 of edition 1
            editionIndex,
            {
              value: 0,
            },
          ),
        );
      }

      await Promise.all(mintingPromises);

      const owners = await contract["getOwners()"]();

      for (let i = 0; i < ownerWallets.length; i++) {
        expect(owners.includes(ownerWallets[i].address)).to.be.true;
      }
    });

    it("Should be query owners by edition", async () => {
      const { contract } = await loadFixture(deployTokenFixture);

      const ownerWallets: HDNodeWallet[] = [];
      const amountOfWallets = 10; // Starts failing around 7000 wallets (10.5k mints)
      const mintingPromises = [];
      const editionOwners: Array<string[]> = [[], []];
      for (let i = 0; i < amountOfWallets; i++) {
        const wallet = ethers.Wallet.createRandom();
        ownerWallets.push(wallet);

        // Half mint 0, half mint 1
        const editionIndex = i % 2;

        editionOwners[editionIndex].push(ownerWallets[i].address);
        mintingPromises.push(
          contract["mint(address,uint256,uint256)"](
            ownerWallets[i].address,
            editionIndex + 1, // Mint 2 of edition 1
            editionIndex,
            {
              value: 0,
            },
          ),
        );
      }

      await Promise.all(mintingPromises);

      const owners0 = await contract["getOwners(uint256)"](0);

      for (let i = 0; i < editionOwners[0].length; i++) {
        expect(owners0.includes(editionOwners[0][i])).to.be.true;
      }
      for (let i = 0; i < editionOwners[1].length; i++) {
        expect(owners0.includes(editionOwners[1][i])).to.be.false;
      }

      const owners1 = await contract["getOwners(uint256)"](1);

      for (let i = 0; i < editionOwners[1].length; i++) {
        expect(owners1.includes(editionOwners[1][i])).to.be.true;
      }
      for (let i = 0; i < editionOwners[0].length; i++) {
        expect(owners1.includes(editionOwners[0][i])).to.be.false;
      }
    });

    //     function getTokensByOwner(address _owner)
    it("Should get tokens by owner regardless of edition", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](owner.address, 3, 1, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: 0,
      });

      const tokenIdsAddr1 = await contract["getTokensByOwner(address)"](addr1.address);

      const tokenIdsOwner = await contract["getTokensByOwner(address)"](owner.address);

      expect(tokenIdsAddr1).to.deep.equal([0n, 1n, 5n, 6n]);
      expect(tokenIdsOwner).to.deep.equal([2n, 3n, 4n]);
    });

    it("Should get tokens by owner regardless of edition version 2", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](owner.address, 3, 1, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 1, {
        value: 0,
      });

      const tokenIdsAddr1 = await contract["getTokensByOwner(address)"](addr1.address);

      const tokenIdsOwner = await contract["getTokensByOwner(address)"](owner.address);

      expect(tokenIdsAddr1).to.deep.equal([0n, 1n, 5n, 6n]);
      expect(tokenIdsOwner).to.deep.equal([2n, 3n, 4n]);
    });

    it("Should get tokens by owner for a specific edition", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](owner.address, 3, 1, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 1, {
        value: 0,
      });

      const tokenIdsAddr1For0 = await contract["getTokensByOwner(address,uint256)"](addr1.address, 0);
      const tokenIdsOwnerFor0 = await contract["getTokensByOwner(address,uint256)"](owner.address, 0);
      const tokenIdsAddr1For1 = await contract["getTokensByOwner(address,uint256)"](addr1.address, 1);
      const tokenIdsOwnerFor1 = await contract["getTokensByOwner(address,uint256)"](owner.address, 1);

      // Check edition 0 results
      expect(tokenIdsAddr1For0).to.deep.equal([0n, 1n]);
      expect(tokenIdsOwnerFor0).to.deep.equal([]);

      // Check edition 1 results
      expect(tokenIdsAddr1For1).to.deep.equal([5n, 6n]);
      expect(tokenIdsOwnerFor1).to.deep.equal([2n, 3n, 4n]);
    });

    it("Should get the correct edtions owned by each person", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](owner.address, 3, 1, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 1, {
        value: 0,
      });

      const addr1EditionsOwned = [...new Set(await contract.getEditionsByOwner(addr1.address))];
      const ownerEditionsOwned = [...new Set(await contract.getEditionsByOwner(owner.address))];

      expect(addr1EditionsOwned).to.deep.equal([0n, 1n]);
      expect(ownerEditionsOwned).to.deep.equal([1n]);
    });

    it("Should return true/false based on ownership", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: 0,
      });

      await contract["mint(address,uint256,uint256)"](owner.address, 3, 1, {
        value: 0,
      });

      expect(await contract.ownsEdition(addr1.address, 0)).to.equal(true);
      expect(await contract.ownsEdition(addr1.address, 1)).to.equal(false);

      expect(await contract.ownsEdition(owner.address, 0)).to.equal(false);
      expect(await contract.ownsEdition(owner.address, 1)).to.equal(true);
    });
  });
});
