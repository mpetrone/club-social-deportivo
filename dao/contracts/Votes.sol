// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

import "./Memberships.sol";
import "./Proposals.sol";

contract Votes {
    Memberships memberships;
    Proposals proposals;

    struct Vote {
        address voter;
        bool inFavor;
        uint256 timestamp;
    }

    mapping(address => address) public voteDelegation;
    mapping(address => address[]) delegationsReceived;

    mapping(uint256 => Vote[]) votes;

    event VoteMade(address voter, uint256 proposalId, bool inFavor);
    event VoteDelegated(address from, address to);


    constructor(address _membershipAddress, address _proposalsAddress) {
        memberships = Memberships(_membershipAddress);
        proposals = Proposals(_proposalsAddress);
    }

    modifier onlyMember() {
        require(memberships.isMember(msg.sender), "Not a member");
        _;
    }

    function vote(uint256 _proposalId, bool _inFavor) external onlyMember {
        require(!hasVoted(msg.sender, _proposalId), "Already voted");
        
        //delegations
        address[] memory delegations = delegationsReceived[msg.sender];
        for (uint i=0; i < delegations.length; i++) {
            if(!hasVoted(delegations[i], _proposalId)){
                _vote(delegations[i], _proposalId, _inFavor);
            }
        }

        //own vote
        _vote(msg.sender, _proposalId, _inFavor);
        emit VoteMade(msg.sender, _proposalId, _inFavor);
    }

    function _vote(address _voter, uint256 _proposalId, bool _inFavor) private {
        Vote memory newVote = Vote(_voter, _inFavor, block.timestamp);
        votes[_proposalId].push(newVote);        
    }

    function delegate(address _to) external onlyMember {
        require(_to != msg.sender, "Self delegation is not allowed");
        require(voteDelegation[_to] != msg.sender, "Recursive delegation is not allowed");
        require(memberships.isMember(_to), "Delegation is not a member");
        bool added = false;
        for (uint i=0; i < delegationsReceived[_to].length; i++) {
            if(delegationsReceived[_to][i] == msg.sender){
                added = true;
            }
        }
        if(!added){
            delegationsReceived[_to].push(msg.sender);
        }
        voteDelegation[msg.sender] = _to;
        emit VoteDelegated(msg.sender, _to);
    }

    //View

    function hasVoted(address _member, uint256 _proposalId) view public returns(bool) {
        Vote[] memory proposalVotes = votes[_proposalId];
        for (uint i=0; i < proposalVotes.length; i++) {
            if(proposalVotes[i].voter == _member){
                return true;
            }
        }
        return false;
    }

    function getAllProposalVotes(uint256 _proposalId) view public returns(Vote[] memory) {
        return votes[_proposalId];
    }

    function getDelegationsReceived(address _address) view public returns(address[] memory) {
        return delegationsReceived[_address];
    }
}
