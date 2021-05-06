const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test membership features", function() {
  var Dao;
  var owner;
  var add1;
  var add2;

  before(async function() {
    [owner, addr1, add2] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("Dao");
    Dao = await factory.deploy();
    await Dao.deployed();
	});

  it("Should let create a membership", async function() {
    const memberName = "carlos";
    
    await Dao.connect(addr1).createMembership(memberName,
     {value: ethers.utils.parseUnits("1", "gwei")});

    expect(await Dao.isMember(addr1.address)).to.equal(true);
    const member = await Dao.members(addr1.address);
    expect(member.name).to.equal(memberName);
  });

  it("Should not let create the membership again", async function() {
    await expect(Dao.connect(addr1).createMembership("bla",
     {value: ethers.utils.parseUnits("1", "gwei")}))
      .to.be.reverted;
  });

  it("Should not create the membership when eth sent is not enough", async function() {
    await expect(Dao.connect(add2).createMembership("bla",
     {value: ethers.utils.parseUnits("0.1", "gwei")}))
      .to.be.reverted;
  });
});
