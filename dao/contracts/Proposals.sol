// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

import "./Memberships.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Proposals {
    using Counters for Counters.Counter;
    Counters.Counter private proposalIds;
    Memberships memberships;

    struct Proposal {
        uint256 proposalId;
        string title; 
        string description;
        bool finished;
        address creator;
    }

    event ProposalCreated(uint256 proposalId);

    Proposal[] public proposals;

    constructor(address _membershipAddress) {
        memberships = Memberships(_membershipAddress);
    }

    function createProposal(
        string memory _title,
        string memory _description
    ) external returns (uint256) {
        require(memberships.isMember(msg.sender), "Not a member");
        proposalIds.increment();
        uint256 newProposalId = proposalIds.current();

        Proposal memory newProposal = Proposal(newProposalId, _title, _description, false, msg.sender);
        proposals.push(newProposal);
        emit ProposalCreated(newProposalId);
        return newProposalId;
    }

    function getAllProposals() external view returns (Proposal[] memory) {
        return proposals;
    } 
}
