const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const deployMockContract = waffle.deployMockContract;
const provider = waffle.provider;

const pohAbi = [
  "function isRegistered(address _submissionID) external view returns(bool)"
];

describe("Test membership features", function() {
  let Dao;
  let owner;
  let addr1;
  let addr2;
  let mockPoh;

  before(async function() {
    [owner, addr1, addr2] = provider.getWallets();
    const daoFactory = await ethers.getContractFactory("Dao");
    mockPoh = await deployMockContract(owner, pohAbi);
    Dao = await daoFactory.deploy(mockPoh.address);
    await Dao.deployed();
	});

  it("Should let create a membership", async function() {
    const memberName = "carlos";
    await mockPoh.mock.isRegistered.withArgs(addr1.address).returns(true);
    
    await Dao.connect(addr1).createMembership(memberName,
     {value: ethers.utils.parseUnits("1", "gwei")});

    expect(await Dao.isMember(addr1.address)).to.equal(true);
    const member = await Dao.members(addr1.address);
    expect(member.name).to.equal(memberName);
    expect(member.carnetId).to.equal(1);
  });

  it("Should not let create the membership again", async function() {
    await expect(Dao.connect(addr1).createMembership("bla",
     {value: ethers.utils.parseUnits("1", "gwei")}))
      .to.be.revertedWith("Already a member");
  });

  it("Should not create the membership when eth sent is not enough", async function() {
    await expect(Dao.connect(addr2).createMembership("bla",
     {value: ethers.utils.parseUnits("0.1", "gwei")}))
      .to.be.revertedWith("Insufficient eth");
  });

  it("Should not create the membership when address is not human", async function() {
    await mockPoh.mock.isRegistered.withArgs(addr2.address).returns(false);

    await expect(Dao.connect(addr2).createMembership("bla",
     {value: ethers.utils.parseUnits("1", "gwei")}))
      .to.be.revertedWith("Not human");
  });
});
