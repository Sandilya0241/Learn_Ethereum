pragma solidity ^0.8.0;

contract HelloWorld {

    string public message;

    function setMessage (string memory newMessage) public {
        message = newMessage;
    }
	
	function remove() public {
        address payable x = payable(0x0);
        selfdestruct(x);
	}
}