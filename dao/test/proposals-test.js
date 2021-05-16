const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;
const utils = ethers.utils

describe("Test proposal features", function() {
  let Proposals;
  let Memberships;
  let MockPoh;
  let owner;
  let addr1;
  let addr2;
  
  before(async function() {
    [owner, addr1, addr2] = provider.getWallets();
    const pohFactory = await ethers.getContractFactory("ProofOfHumanityMock");
    const memebershipsFactory = await ethers.getContractFactory("Memberships");
    const proposalsFactory = await ethers.getContractFactory("Proposals");
    MockPoh = await pohFactory.deploy();
    Memberships = await memebershipsFactory.deploy(MockPoh.address);
    Proposals = await proposalsFactory.deploy(Memberships.address);
    await Proposals.deployed();
  });

  async function setMembershipFor(addr) {
    await MockPoh.addHuman(addr.address)
    await Memberships.connect(addr).createMembership("firstname", "lastname", "imgUrl",
     {value: ethers.utils.parseUnits("1", "gwei")});
    expect(await Memberships.isMember(addr.address)).to.equal(true);
  }

  it("Should let a member to create a proposal", async function() {
    const title = "a title"
    const description = "This is a description of a valid proposal"

    await setMembershipFor(addr1);

    const newId = await Proposals.connect(addr1).createProposal(title, description);

    const proposal = await Proposals.proposals(newId.value);
    expect(proposal.title).to.equal(title);
    expect(proposal.description).to.equal(description);
    expect(proposal.finished).to.equal(false);
    expect(proposal.creator).to.equal(addr1.address);
  });

  it("Should not let a non member to create a proposal", async function() {
    const title = "a title"
    const description = "This is a description of a valid proposal"

    await expect(Proposals.connect(addr2).createProposal(title, description))
      .to.be.revertedWith("Not a member");
  });
});