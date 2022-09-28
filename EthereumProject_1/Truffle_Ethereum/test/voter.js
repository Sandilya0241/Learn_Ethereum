let Voter = artifacts.require("./Voter.sol");

contract("Voter tests", async function(accounts){
	let voter;
	let firstAccount;
	
	async function setOptions(acc, options) {
		for (pos in options) {
			await voter.addOption(options[pos], {from:acc});
		}
		await voter.startVoting({from:acc});
	}
	
	beforeEach(async function(){
		firstAccount = accounts[0];
		voter = await Voter.new();
		await setOptions(firstAccount, ['coffee', 'tea']);
	});
	
	/*No votes in the beginning test case*/
	it('no votes in the beginning', async function() {
		let votes = await voter.getVotes.call();
		expect(toNumbers(votes)).to.deep.equal([0,0]);
	});
	
	/*vote using a string and test case
	it('vote using a string', async function() {
		await voter.contract.vote['string'](
		"coffee",
		{from: firstAccount});
		let votes = await voter.getVotes.call();
		expect(toNumbers(votes)).to.deep.equal([1,0]);
	});*/
	
	/*vote using an option and test case
	it('vote using an option and test case', async function() {
		await voter.contract.vote['uint256'](
		0,
		{from: firstAccount});
		let votes = await voter.getVotes.call();
		expect(toNumbers(votes)).to.deep.equal([1,0]);
	});
	*/
	
	const ERR_MSG = "VM Exception while processing transaction: revert"; 
	/*Cannot vote twice using the same account*/
	it('Cannot vote twice using the same account', async function() {
		try {
			await voter.contract.vote['uint256'](0, {from: firstAccount});
			await voter.contract.vote['uint256'](0, {from: firstAccount});
			except.fail();
		} catch(ex) {
			expect(ex.message).to.equal(ERR_MSG);
		}
	});
	
	function toNumbers(bigNumbers) {
		return bigNumbers.map(function(bigNumer){
			return bigNumer.toNumber();
		});
	}
});