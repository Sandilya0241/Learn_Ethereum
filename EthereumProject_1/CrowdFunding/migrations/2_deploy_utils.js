let Utils = artifacts.require("./Utils.sol");
let crowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");
let testCrowdFundingWithDeadline = artifacts.require("./TestCrowdFundingWithDeadline.sol");

module.exports = async function(deployer){
	await deployer.deploy(Utils);
	deployer.link(Utils, crowdFundingWithDeadline);
	deployer.link(Utils, testCrowdFundingWithDeadline);
};