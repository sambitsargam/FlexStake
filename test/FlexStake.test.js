const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlexStake", function () {
  let FlexStake;
  let flexStake;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    FlexStake = await ethers.getContractFactory("FlexStake");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    flexStake = await FlexStake.deploy(10); // 10% reward rate
    await flexStake.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await flexStake.owner()).to.equal(owner.address);
    });

    it("Should set the right reward rate", async function () {
      expect(await flexStake.rewardRate()).to.equal(10);
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      expect(await flexStake.stakes(addr1.address)).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should emit a Staked event when tokens are staked", async function () {
      await expect(flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") }))
        .to.emit(flexStake, "Staked")
        .withArgs(addr1.address, ethers.utils.parseEther("1"));
    });

    it("Should not allow staking 0 tokens", async function () {
      await expect(flexStake.connect(addr1).stake({ value: 0 })).to.be.revertedWith("Cannot stake 0");
    });

    it("Should allow users to stake with duration", async function () {
      await flexStake.connect(addr1).newStake(ethers.utils.parseEther("1"), 30);
      expect(await flexStake.stakes(addr1.address)).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should emit a NewStake event when tokens are staked with duration", async function () {
      await expect(flexStake.connect(addr1).newStake(ethers.utils.parseEther("1"), 30))
        .to.emit(flexStake, "NewStake")
        .withArgs(addr1.address, ethers.utils.parseEther("1"), 30);
    });

    it("Should not allow staking 0 tokens with duration", async function () {
      await expect(flexStake.connect(addr1).newStake(0, 30)).to.be.revertedWith("Cannot stake 0");
    });

    it("Should not allow staking with 0 duration", async function () {
      await expect(flexStake.connect(addr1).newStake(ethers.utils.parseEther("1"), 0)).to.be.revertedWith("Duration must be greater than 0");
    });
  });

  describe("Unstaking", function () {
    it("Should allow users to unstake tokens", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await flexStake.connect(addr1).unstake(ethers.utils.parseEther("1"));
      expect(await flexStake.stakes(addr1.address)).to.equal(0);
    });

    it("Should emit an Unstaked event when tokens are unstaked", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await expect(flexStake.connect(addr1).unstake(ethers.utils.parseEther("1")))
        .to.emit(flexStake, "Unstaked")
        .withArgs(addr1.address, ethers.utils.parseEther("1"));
    });

    it("Should not allow unstaking 0 tokens", async function () {
      await expect(flexStake.connect(addr1).unstake(0)).to.be.revertedWith("Cannot unstake 0");
    });

    it("Should not allow unstaking more than staked", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await expect(flexStake.connect(addr1).unstake(ethers.utils.parseEther("2"))).to.be.revertedWith("Insufficient stake");
    });
  });

  describe("Delegation", function () {
    it("Should allow users to delegate tokens", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await flexStake.connect(addr1).delegate(ethers.utils.parseEther("0.5"));
      expect(await flexStake.delegations(addr1.address)).to.equal(ethers.utils.parseEther("0.5"));
    });

    it("Should emit a Delegated event when tokens are delegated", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await expect(flexStake.connect(addr1).delegate(ethers.utils.parseEther("0.5")))
        .to.emit(flexStake, "Delegated")
        .withArgs(addr1.address, ethers.utils.parseEther("0.5"));
    });

    it("Should not allow delegating 0 tokens", async function () {
      await expect(flexStake.connect(addr1).delegate(0)).to.be.revertedWith("Cannot delegate 0");
    });

    it("Should not allow delegating more than staked", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await expect(flexStake.connect(addr1).delegate(ethers.utils.parseEther("2"))).to.be.revertedWith("Insufficient stake");
    });
  });

  describe("Rewards", function () {
    it("Should distribute rewards correctly", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await flexStake.connect(addr2).stake({ value: ethers.utils.parseEther("2") });

      await flexStake.distributeRewards();

      expect(await flexStake.rewards(addr1.address)).to.equal(ethers.utils.parseEther("0.1"));
      expect(await flexStake.rewards(addr2.address)).to.equal(ethers.utils.parseEther("0.2"));
    });

    it("Should allow users to claim rewards", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await flexStake.distributeRewards();
      await flexStake.connect(addr1).claimReward();
      expect(await flexStake.rewards(addr1.address)).to.equal(0);
    });

    it("Should emit a RewardPaid event when rewards are claimed", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await flexStake.distributeRewards();
      await expect(flexStake.connect(addr1).claimReward())
        .to.emit(flexStake, "RewardPaid")
        .withArgs(addr1.address, ethers.utils.parseEther("0.1"));
    });

    it("Should not allow claiming 0 rewards", async function () {
      await expect(flexStake.connect(addr1).claimReward()).to.be.revertedWith("No rewards to claim");
    });

    it("Should correctly distribute rewards after bug fix", async function () {
      await flexStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
      await flexStake.connect(addr2).stake({ value: ethers.utils.parseEther("2") });

      await flexStake.distributeRewards();

      expect(await flexStake.rewards(addr1.address)).to.equal(ethers.utils.parseEther("0.1"));
      expect(await flexStake.rewards(addr2.address)).to.equal(ethers.utils.parseEther("0.2"));
    });
  });
});
