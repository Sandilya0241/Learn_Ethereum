pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../contracts/Voter.sol";

contract TestVoter {
	function testVoterForAnOptionUsingNumericIndex() public {
		Voter voter = new Voter();
		
		voter.addOption("One");
		voter.addOption("Two");
		
		voter.startVoting();
		
		voter.vote(0);
		
		uint[] memory votes = voter.getVotes();
		uint[] memory expected = new uint[](2);
		expected[0] = 1;
		expected[1] = 0;
		
		Assert.equal(votes, expected, "First options is only voted");
		
	}
}