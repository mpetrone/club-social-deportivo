//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "./CarnetERC721.sol";
import "./IProofOfHumanity.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Memberships is Ownable {

  struct Member {
    string firstname;
    string lastname;
    string imgUrl;
    uint256 carnetId;
  }
  CarnetERC721 carnetERC721;
  IProofOfHumanity proofOfHumanity;
  uint256 public inscriptionFee = 1 gwei;

  mapping (address => Member) public members;

  constructor(address _pohAddress) {
    carnetERC721 = new CarnetERC721();
    proofOfHumanity = IProofOfHumanity(_pohAddress);
  }

  function createMembership(
    string memory _firstname,
    string memory _lastname,
    string memory _imgUrl
  ) external payable {
    require(!isEmpty(_firstname), "Empty firstname");
    require(!isEmpty(_lastname), "Empty lastname");
    require(!isEmpty(_imgUrl), "Empty Url");
    require(msg.value >= inscriptionFee, "Insufficient eth");
    require(isEmpty(members[msg.sender].firstname), "Already a member");
    require(proofOfHumanity.isRegistered(msg.sender), "Not human");

    uint256 carnetId = carnetERC721.mint(msg.sender);
    members[msg.sender] = Member(_firstname, _lastname, _imgUrl, carnetId);
  }

  function isMember(address _address) public view returns(bool) {
    return !isEmpty(members[_address].firstname);
  }

  function isEmpty(string memory _input) private pure returns(bool) {
    return bytes(_input).length == 0;
  }

  function setInscriptionFee(uint256 _inscriptionFee) external onlyOwner {
    inscriptionFee = _inscriptionFee;
  }
}
