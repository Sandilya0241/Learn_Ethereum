
let path = require("path");
let fs = require('fs');
let solc = require('solc');
let Web3 = require('web3');

let contract = compileContract();

//let web3 = createWeb3();
//let sender = "0x427916d040edf914a8b3ba21dcd79321035488a8";

deployContract(web3, contract, sender).then(function(){
    console.log("Deployment Finished");
}).catch(function(error){
    Console.log('Failed to deploy contract : ${error}');
});

function compileContract() {
	
	const VoterPath = path.resolve(__dirname, 'Voter.sol');
	
	let compilerInput = {
		'Voter':fs.readFileSync('Voter.sol','utf-8')
	};
	console.log("compiling the contract");
	
	// Compile and Optimize the contract
	let compiledContract = solc.compile({sources: compilerInput}, 1);
	console.log("#################################################");
	console.log(compiledContract);
	console.log("#################################################");
	// Get compiled contract
	//let contract = compiledContract.contracts['Voter:Voter'];
	/*
	// Save contract's ABI
	let abi =  contract.abi;
	fs.writeFileSync('abi.json', abi);
	
	*/
	
	//var compiled = solc.compile(source, 1) // 1 activates the optimiser
	/*if (compiled.errors) {
		console.log('[error] compile error')
		for (var msg in compiled.errors) console.log(compiled.errors[msg])
	} else {
		
		console.log("111111111111111111111111Else section@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
	}*/
	//return compiled
	return "";
}
/*
function createWeb3() {
	let web3 = new Web3();
	web3.setProvider(new web3.providers.HttpProvider('https://localhost:8545'));
	return web3;
}


async function deployContract(web3, contract, sender) {
	// First create an instance of our contract
	let Voter = new web3.eth.Contract(JSON.parse(contract.interface));
	
	// We need bytecode of our contract
	let bytecode = '0x' + contract.bytecode;
	
	// We need to pass gas to transaction. We have estimateGas method on web3 to let us know
	let gasEstimate = await web3.eth.estimateGas({data: bytecode});
	
	// With these inputs we can call deploy method on our smart contract
	//deploy method on contract instance will only create a transaction.
	// To send that transaction, we need to call send method.
	// Also send method has interesting feature. It allows us to subscribe to events on the Ethereum network.
	// To do this we need to use ".on" method and pass the name of the events that we want to subscribe to and the function that should be called when this event occurs.
	console.log('Deploying the smart contract');
	const contractInstance = await Voter.deploy({
		data:bytecode
	}).send({
		from:sender,
		gas:gasEstimate
	})
	.on('transactionHash', function(transactionHash) {
		console.log('Transaction Hash: ${transactionHash}');
	})
	.on('confirmation', function(confirmationNumber, receipt) {
		console.log('Confirmation number: ${confirmationNumber}');
	})
	
	console.log('Contract Address: ${contractInstance.options.address}');
}
*/