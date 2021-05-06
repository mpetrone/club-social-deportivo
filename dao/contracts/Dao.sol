//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "hardhat/console.sol";

contract Dao {
  struct Member {
    string name;
    address ntfAddress;
  }

  mapping (address => Member) public members;

  constructor() {
  }

  function createMembership(string memory _name) external payable {
    require(!isEmpty(_name), "Empty name");
    require(msg.value >= 1 gwei, "Insufficient eth");
    require(isEmpty(members[msg.sender].name), "Already a member");

    members[msg.sender] = Member(_name, msg.sender);
  }

  function isMember(address _address) public view returns(bool) {
    return !isEmpty(members[_address].name);
  }

  function isEmpty(string memory _input) private pure returns(bool) {
    return bytes(_input).length == 0;
  }
}
