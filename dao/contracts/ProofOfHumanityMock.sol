//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

contract ProofOfHumanityMock {
  mapping (address => bool) public humans;
  event NewHuman(address humanAddres);


	function isRegistered(address _address) external view returns (bool) {
    return humans[_address];
  }

  function addHuman(address _address) external {
    humans[_address] = true;
    emit NewHuman(_address);
  }
}
    