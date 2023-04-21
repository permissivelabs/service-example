// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@op/access/Ownable.sol";
import "@op/token/ERC20/ERC20.sol";

contract Farm is Ownable, ERC20 {
    uint public rate;
    mapping(address => uint) public lastHarvest;

    constructor(uint _rate) ERC20("Wheat", "WHT") {
        rate = _rate;
    }

    function setRate(uint _rate) external onlyOwner {
        rate = _rate;
    }

    function harvest() external {
        uint timeInterval = block.timestamp - lastHarvest[msg.sender];
        uint wheatHarvested = timeInterval * rate;
        if (lastHarvest[msg.sender] == 0) {
            wheatHarvested = 1 ether;
        }
        lastHarvest[msg.sender] = block.timestamp;
        _mint(msg.sender, wheatHarvested);
    }
}
