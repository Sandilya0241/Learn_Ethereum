let CrowdFundingWithDeadline = artifacts.require("./TestCrowdFundingWithDeadline");

contract('CrowdFundingWithDeadline Tests',function(accounts){
	let contract;
	let contractCreator = accounts[0];
	let beneficiary = accounts[1];
	
	const ONE_ETH = 1000000000000000000;
	const ERR_MSG = "Returned error: VM Exception while processing transaction: revert";
	const STATE_ONGOING = '0';
	const STATE_FAILED = '1';
	const STATE_SUCCEEDED = '2';
	const STATE_PAID_OUT = '3';
	
	
	beforeEach(async function(){
		contract = await CrowdFundingWithDeadline.new("Funding Contract", 1, 10, beneficiary, {from: contractCreator,gas: 2000000});
	});
	
	it("First set of tests 1", async function(){
		let campaignName = await contract.name.call();
		expect(campaignName).to.equal("Funding Contract");
		
		let targetAmount = await contract.targetAmount.call();
		expect(targetAmount).to.eql(web3.utils.toBN(web3.utils.toWei("1", "ether")));
		
		let fundingDeadline = await contract.fundingDeadline.call();
		expect(fundingDeadline).to.eql(web3.utils.toBN(600));
		
		let actualBeneficiary = await contract.beneficiary.call();
		expect(actualBeneficiary).to.equal(beneficiary);
		
		let state = await contract.state.call();
		expect(state.valueOf()).to.eql(web3.utils.toBN(STATE_ONGOING));
		
	});
	
	it("Funds are contributed", async function(){
		await contract.contribute({
			value : ONE_ETH,
			from: contractCreator
		});
		
		let contributed = await contract.amounts.call(contractCreator);
		expect(contributed).to.eql(web3.utils.toBN(web3.utils.toWei("1","ether")));
		
		let totalCollectedAmount = await contract.totalCollected.call();
		expect(totalCollectedAmount).to.eql(web3.utils.toBN(web3.utils.toWei("1","ether")));
		
	});
	
	it("Cannot contribute after deadline", async function(){
		try {
			await contract.setCurrentTime(601);
			await contract.sendTransaction({
				value:ONE_ETH,
				from:contractCreator
			});
			expect.fail();
		} catch (error) {
			expect(error.message).to.equal(ERR_MSG);
		}
	});
	
	it("Crowd funding succeeded", async function(){
		await contract.contribute({value: ONE_ETH, from: contractCreator});
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();
		let currentState = await contract.state.call();
		
		expect(currentState.valueOf()).to.eql(web3.utils.toBN(STATE_SUCCEEDED));
	});
	
	it("Crowd funding failed", async function(){
		
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();
		let currentState = await contract.state.call();
		
		expect(currentState.valueOf()).to.eql(web3.utils.toBN(STATE_FAILED));
	});
	
	it("Collected money paidout", async function(){
		await contract.contribute({value: ONE_ETH, from: contractCreator});
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();
		
		let initBalance = await web3.eth.getBalance(beneficiary);
		await contract.collect({from: contractCreator});
		
		let newBalance = await web3.eth.getBalance(beneficiary);
		expect(newBalance - initBalance).to.equal(ONE_ETH);
		
		let currentState = await contract.state.call();
		expect(currentState.valueOf()).to.eql(web3.utils.toBN(STATE_PAID_OUT));
	});
	
	it("Withdraw money from the contract", async function(){
		await contract.contribute({value: ONE_ETH - 100, from: contractCreator});
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();
		await contract.withdraw({from: contractCreator});
		
		let amt = await contract.amounts.call(contractCreator);
		expect(amt).to.eql(web3.utils.toBN(0));
	});
	
	/*it("Events are emitting", async function(){
		let watcher = contract.finishCrowdFundingEvt();
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();
		
		let events = watcher.get();
		let event = events[0];
		
		expect(event.arg.totalCollected).to.eql(web3.utils.toBN(0));
		expect(event.arg.succeeded).to.equal(false);
	});*/
});