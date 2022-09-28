pragma solidity ^0.8.0;

import "./Utils.sol";

contract CrowdFundingWithDeadLine {

	using Utils for *;

	enum State {Ongoing, Failed, Succeeded, PaidOut}
	
	event finishCrowdFundingEvt (address addr, uint totalCollected, bool succeeded);
	
	string public name;
	uint public targetAmount;
	uint public fundingDeadline;
	address payable public beneficiary;
	State public state;
	mapping(address=>uint) public amounts;
	bool public collected;
	uint public totalCollected;
	
	modifier inState(State expectedState){
		require(state == expectedState, "Invalid State");
		_;
	}
	
	constructor(string memory contractName, uint targetAmountEth, uint durationInMin, address payable beneficiaryAddress) public {
		name = contractName;
		targetAmount = Utils.etherToWei(targetAmountEth);
		fundingDeadline = currentTime() + Utils.minutesToSeconds(durationInMin);
		beneficiary = beneficiaryAddress;
		state = State.Ongoing;
	}
	
	function currentTime() internal virtual view returns(uint) {
		return block.timestamp;
	}
	
	function contribute() public payable inState(State.Ongoing) {
	
		require(beforeDeadline(),"No contributions after deadline");
		
		amounts[msg.sender] += msg.value;
		totalCollected += msg.value;
		
		if(totalCollected >= targetAmount) {
			collected = true;
		}
	}
	
	function beforeDeadline() public view returns(bool) {
		return currentTime() < fundingDeadline;
	}
	
	function finishCrowdFunding() public inState(State.Ongoing) {
		require(!beforeDeadline(), "Cannot finish campaign before deadline");
		
		if(!collected) {
			state = State.Failed;
		} else {
			state = State.Succeeded;
		}
		
		emit finishCrowdFundingEvt(address(this), totalCollected, collected);
	}
	
	function collect() public inState(State.Succeeded) {
		if(beneficiary.send(totalCollected)) {
			state = State.PaidOut;
		} else {
			state = State.Failed;
		}
	}
	
	function withdraw() public inState(State.Failed) {
		require(amounts[msg.sender] > 0, "Nothing was contributed");
		
		uint contributedAmt = amounts[msg.sender];
		amounts[msg.sender] = 0;
		
		if(!payable(msg.sender).send(contributedAmt)) {
			amounts[msg.sender] = contributedAmt;
		}
	}
}