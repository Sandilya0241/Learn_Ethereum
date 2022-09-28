pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract MultiSigWallet {
	uint minApprovers;
	
	address payable beneficiary;
	address public owner;
	
	mapping(address=>bool) approvedBy;
	mapping(address=>bool) isApprover;
	
	uint approvalsNum;
	
	constructor(
		address[] memory _approvers,
		uint _minApprovers,
		address payable _beneficiary
	) public payable {
		require(_minApprovers <= _approvers.length, "Required number of approvers should be less than number of approvers");
		
		minApprovers = _minApprovers;
		beneficiary = _beneficiary;
		owner = msg.sender;
		
		for(uint cnt = 0; cnt < _approvers.length; cnt++) {
			address approver = _approvers[cnt];
			isApprover[approver] = true;
		}
	}
	
	function approve() public{
		require(isApprover[msg.sender], "Not an approver");
		if(!approvedBy[msg.sender]) {
			approvalsNum += 1;
			approvedBy[msg.sender] = true;
		}
		
		if(approvalsNum == minApprovers) {
			beneficiary.send(address(this).balance);
			selfdestruct(payable(owner));
		}
	}
	
	function deny() public{
		require(isApprover[msg.sender], "Not an approver");
		selfdestruct(payable(owner));
	}
}