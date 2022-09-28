pragma solidity ^0.8.0;

import "./CrowdFundingWithDeadLine.sol";

contract TestCrowdFundingWithDeadLine is CrowdFundingWithDeadLine{
	uint time;
	
	constructor(string memory contractName, uint targetAmountEth, uint durationInMin, address payable beneficiaryAddress) CrowdFundingWithDeadLine(contractName, targetAmountEth, durationInMin, beneficiaryAddress) public {
	}
	
	function currentTime() internal override view returns(uint){
		return time;
	}
	
	function setCurrentTime(uint newTime) public{
		time = newTime;
	}
}