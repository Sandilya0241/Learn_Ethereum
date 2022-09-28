pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract Voter {
	
	struct OptionPos {
		uint pos;
		bool exists;
	}
	
	// Fields
	uint[] public votes;
	string[] public options;
	mapping(address=>bool) hasVoted;
	mapping(string=>OptionPos) posOfOption;
	
	constructor(string[] memory _options) public{
		options = _options;
		votes = new uint[] (options.length);
		for (uint cnt = 0; cnt < options.length; cnt++) {
			OptionPos memory optionPos = OptionPos(cnt, true);
			string memory optionName = options[cnt];
			posOfOption[optionName] = optionPos;
		}
	}
	
	function vote(uint option) public {
		require(option >= 0 && option < options.length, "Invalid Option");
		require(!(hasVoted[msg.sender]), "Account has already voted");
		votes[option] += 1;
		hasVoted[msg.sender] = true;
	}
	
	function vote(string memory optionName) public {
		require(!(hasVoted[msg.sender]), "Account has already voted");
		
		OptionPos memory optionPos = posOfOption[optionName];
		require(optionPos.exists, "Option does not exists");
		
		votes[optionPos.pos] += 1;
		hasVoted[msg.sender] = true;
	}
	
	function getVotes() public view returns (uint[] memory) {
		return votes;
	}
	
	function getOptions() public view returns (string[] memory){
		return options;
	}
}