let path = require('path');
let fs = require('fs');
let solc = require('solc');
let voterPath = path.resolve(__dirname,'Voter.sol');
let srcCodeObj =  fs.readFileSync(voterPath, 'utf8');
let voterInput = {
	language:'Solidity',
	sources:{
		'Voter.sol':{
			content:srcCodeObj,
		},
	},
	settings:{
		outputSelection:{
			'*':{
				'*':["abi", "evm.bytecode"],
			},
		},
	},
};
try {
	console.log("Compiling");
	let output = solc.compile(JSON.stringify(voterInput));
	console.log(output);
	console.log("Compiled");
} catch(Ex) {
	console.log("Exception occured");
	console.log(Ex);
}
