let fs = require('fs');
let Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(
	new web3.providers.HttpProvider("http://localhost:7545")
	);
	
let contractAddress = "0xf224Acadffd2482Bf7b0E0fC8A6F904640707078"; // Address received after deploying the contract

let fromAddress = "0xa7F1095e8b7F9A0194E02EAEd534081BdCA083D1"; // Our address

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
	await voter.methods['vote(uint256)'](1).send({from:fromAddress,gas:600000});
	
	console.log('Getting votes');
	let votes = await voter.methods.getVotes().call({from:fromAddress});
	
	
	console.log('Votes: ' + votes);
}