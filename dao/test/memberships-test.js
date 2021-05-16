const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

describe("Test membership features", function() {
  let Memberships;
  let MockPoh;
  let owner;
  let addr1;
  let addr2;
  
  before(async function() {
    [owner, addr1, addr2] = provider.getWallets();
    const membershipsFactory = await ethers.getContractFactory("Memberships");
    const pohFactory = await ethers.getContractFactory("ProofOfHumanityMock");
    MockPoh = await pohFactory.deploy();
    Memberships = await membershipsFactory.deploy(MockPoh.address);
    await Memberships.deployed();
	});

  it("Should let create a membership", async function() {
    const firstname = "Lionel";
    const lastname = "Messi";
    const imgUrl = "an url"

    await MockPoh.addHuman(addr1.address)
    
    await Memberships.connect(addr1).createMembership(firstname, lastname, imgUrl,
     {value: ethers.utils.parseUnits("1", "gwei")});

    expect(await Memberships.isMember(addr1.address)).to.equal(true);
    const member = await Memberships.members(addr1.address);
    expect(member.firstname).to.equal(firstname);
    expect(member.lastname).to.equal(lastname);
    expect(member.imgUrl).to.equal(imgUrl);
    expect(member.carnetId).to.equal(1);
  });

  it("Should not let create the membership again", async function() {
    await expect(Memberships.connect(addr1).createMembership("bla", "bla", "bla",
     {value: ethers.utils.parseUnits("1", "gwei")}))
      .to.be.revertedWith("Already a member");
  });

  it("Should not create the membership when firstname is empty", async function() {
    await expect(Memberships.connect(addr2).createMembership("", "bla", "bla",
     {value: ethers.utils.parseUnits("0.1", "gwei")}))
      .to.be.revertedWith("Empty firstname");
  });

  it("Should not create the membership when eth sent is not enough", async function() {
    await expect(Memberships.connect(addr2).createMembership("bla", "bla", "bla",
     {value: ethers.utils.parseUnits("0.1", "gwei")}))
      .to.be.revertedWith("Insufficient eth");
  });

  it("Should not create the membership when address is not human", async function() {
    await expect(Memberships.connect(addr2).createMembership("bla", "bla", "bla",
     {value: ethers.utils.parseUnits("1", "gwei")}))
      .to.be.revertedWith("Not human");
  });

  it("Should let the owner change the inscription fee", async function() {
    const newInscriptionFee = ethers.utils.parseUnits("0.5", "gwei")

    await expect(Memberships.connect(addr1).setInscriptionFee(newInscriptionFee))
      .to.be.revertedWith("Ownable: caller is not the owner");

    await Memberships.connect(owner).setInscriptionFee(newInscriptionFee)

    const inscriptionFee = await Memberships.inscriptionFee();
    expect(inscriptionFee).to.equal(newInscriptionFee);
  });
});
