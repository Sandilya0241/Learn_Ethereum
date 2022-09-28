let fs = require('fs');
let Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(
	new web3.eth.HttpProvider("http://localhost:8545"));
	
let contractAddress = "0x..."; // Address received after deploying the contract

let fromAddress = "0x..."; // Our address

let abiStr = fs.readFileSync('abi.json', 'utf8');

let abi = JSON.parse(abiStr);

let voter = new web3.eth.Contract(abi, contractAddress);

sendTransaction()
.then(function() {
	console.log("Done");
}).catch(function(error) {
	console.log(error);
})

async function sendTransaction() {
	console.log("Adding option 'Coffee'");
	await voter.methods.addOption("coffee").send({from:fromAddress});
	
	console.log("Adding option 'tea'");
	await voter.methods.addOption("tea").send({from:fromAddress});
	
	await voter.methods.startVoting().send({from:fromAddress,gas:600000});
	
	console.log("Voting");
	await voter.methods['vote(uint256)'](0).send({from:fromAddress,gas:600000});
	
	console.log('Getting votes');
	let votes = await voter.methods.getVotes().call({from:fromAddress});
	
	console.log('Votes: ${votes}');
}