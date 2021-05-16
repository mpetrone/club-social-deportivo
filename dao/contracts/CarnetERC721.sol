//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CarnetERC721 is ERC721, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _carnetIds;

  constructor() ERC721("Club Social Deportivo", "CSD") {}

	function mint(address member) external onlyOwner returns (uint256){
    _carnetIds.increment();

    uint256 newCarnetId = _carnetIds.current();
  	_mint(member, newCarnetId);

  	return newCarnetId;
  }
}