var EmploymentContract = artifacts.require("./EmploymentContract.sol");
var EmployeeContract = artifacts.require("./EmployeeContract.sol");
var EmploymentFactoryContract = artifacts.require("./EmploymentContractFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(EmploymentContract);
  deployer.deploy(EmployeeContract);
  deployer.deploy(EmploymentFactoryContract);
};

