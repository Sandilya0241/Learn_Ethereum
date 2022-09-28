
pragma solidity >=0.5.0 <0.9.0;
contract Voter {
	
	struct OptionPos {
		uint pos;
		bool exists;
	}
	
	/*constructor(string memory passedName) public {
	}*/
	
	// Fields
	uint[] public votes = new uint[](1);
	string[] public options;
	mapping(address=>bool) hasVoted;
	mapping(string=>OptionPos) posOfOption;
	bool votingStarted;
	
	
	function addOption(string memory option) public {
		require(!votingStarted);
		options.push(option);
	}
	
	function startVoting() public{
		require(!votingStarted);
		//votes.length = options.length;
		
		for (uint cnt = 0; cnt < options.length; cnt++) {
			OptionPos memory option = OptionPos(cnt, true);
			posOfOption[options[cnt]] = option;
		}
		votingStarted = true;
	}
	
	function vote(uint option) public {
		require(option >= 0 && option < options.length);
		require(!(hasVoted[msg.sender]));
		votes[option] += 1;
		hasVoted[msg.sender] = true;
	}
	
	function vote(string memory optionName) public {
		require(!(hasVoted[msg.sender]));
		
		OptionPos memory optionPos = posOfOption[optionName];
		require(optionPos.exists);
		
		votes[optionPos.pos] += 1;
		hasVoted[msg.sender] = true;
	}
	
	function getVotes() public view returns (uint[] memory) {
		return votes;
	}
}