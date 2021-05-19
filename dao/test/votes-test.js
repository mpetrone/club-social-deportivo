const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;
const utils = ethers.utils

describe("Test proposal features", function() {
  let Votes;
  let Proposals;
  let Memberships;
  let MockPoh;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  
  before(async function() {
    [owner, addr1, addr2, addr3, addr4] = provider.getWallets();
    const pohFactory = await ethers.getContractFactory("ProofOfHumanityMock");
    const memebershipsFactory = await ethers.getContractFactory("Memberships");
    const proposalsFactory = await ethers.getContractFactory("Proposals");
    const votesFactory = await ethers.getContractFactory("Votes");
    MockPoh = await pohFactory.deploy();
    Memberships = await memebershipsFactory.deploy(MockPoh.address);
    Proposals = await proposalsFactory.deploy(Memberships.address);
    Votes = await votesFactory.deploy(Memberships.address, Proposals.address);
    await Votes.deployed();
  });

  async function setMembershipFor(addr) {
    await MockPoh.addHuman(addr.address)
    await Memberships.connect(addr).createMembership("firstname", "lastname", "imgUrl",
     {value: ethers.utils.parseUnits("1", "gwei")});
    expect(await Memberships.isMember(addr.address)).to.equal(true);
  }

  async function createProposal(addr) {
    const transaction = await Proposals.connect(addr).createProposal("title", "description");
    const result = await transaction.wait()
    return result.events[0].args[0].toNumber();
  }

  it("Should let a member to vote", async function() {
    await setMembershipFor(addr1);
    const newId = await createProposal(addr1);
    await Votes.connect(addr1).vote(newId, true)

    const votes = await Votes.getAllProposalVotes(newId)
    expect(votes.length).to.equal(1)
    const vote = votes[0]
    expect(vote.voter).to.equal(addr1.address)
    expect(vote.inFavor).to.equal(true)
  });

  it("Should not let a member to vote twice", async function() {
    const newId = await createProposal(addr1);

    expect(await Votes.hasVoted(addr1.address, newId)).to.equal(false)
    await Votes.connect(addr1).vote(newId, true)
    expect(await Votes.hasVoted(addr1.address, newId)).to.equal(true)
    await expect(Votes.connect(addr1).vote(newId, true))
      .to.be.revertedWith("Already voted");
  });

  it("Should not let a non member to vote", async function() {
    await expect(Votes.connect(addr2).vote(1, false))
      .to.be.revertedWith("Not a member");
  });

  it("Should not let a member to delegate the vote to a no member", async function() {
    await setMembershipFor(addr3);
    await expect(Votes.connect(addr3).delegate(addr4.address))
      .to.be.revertedWith("Delegation is not a member");
  });

  it("Should not let a member to delegate the vote to himself", async function() {
    await expect(Votes.connect(addr3).delegate(addr3.address))
      .to.be.revertedWith("Self delegation is not allowed");
  });

  it("Should let a member to delegate the vote", async function() {
    await setMembershipFor(addr4);
    const newId = await createProposal(addr4);
    await Votes.connect(addr3).delegate(addr4.address)
    await Votes.connect(addr4).vote(newId, true)
    await expect(Votes.connect(addr3).vote(newId, true))
      .to.be.revertedWith("Already voted");

    expect(await Votes.voteDelegation(addr3.address)).to.eql(addr4.address)
    expect(await Votes.getDelegationsReceived(addr4.address)).to.eql([addr3.address])


    const votes = await Votes.getAllProposalVotes(newId)
    expect(votes.length).to.equal(2)
    const vote1 = votes[0]
    expect(vote1.voter).to.equal(addr3.address)
    expect(vote1.inFavor).to.equal(true)
    const vote2 = votes[1]
    expect(vote2.voter).to.equal(addr4.address)
    expect(vote2.inFavor).to.equal(true)
  });

  it("Should not let a recursive delegation of the vote", async function() {
    await expect(Votes.connect(addr4).delegate(addr3.address))
      .to.be.revertedWith("Recursive delegation is not allowed");
  });
});