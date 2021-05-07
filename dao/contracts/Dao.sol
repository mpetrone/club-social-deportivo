//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "./CarnetERC721.sol";
import "./IProofOfHumanity.sol";

contract Dao {

  struct Member {
    string name;
    uint256 carnetId;
  }
  CarnetERC721 carnetERC721;
  IProofOfHumanity proofOfHumanity;

  mapping (address => Member) public members;

  constructor(address _pohAddress) {
    carnetERC721 = new CarnetERC721();
    proofOfHumanity = IProofOfHumanity(_pohAddress);
  }

  function createMembership(string memory _name) external payable {
    require(!isEmpty(_name), "Empty name");
    require(msg.value >= 1 gwei, "Insufficient eth");
    require(isEmpty(members[msg.sender].name), "Already a member");
    require(proofOfHumanity.isRegistered(msg.sender), "Not human");

    uint256 carnetId = carnetERC721.mint(msg.sender);
    members[msg.sender] = Member(_name, carnetId);
  }

  function isMember(address _address) public view returns(bool) {
    return !isEmpty(members[_address].name);
  }

  function isEmpty(string memory _input) private pure returns(bool) {
    return bytes(_input).length == 0;
  }
}
