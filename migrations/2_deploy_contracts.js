var EmploymentContract = artifacts.require("./EmploymentContract.sol");
var EmployeeContract = artifacts.require("./EmployeeContract.sol");

module.exports = function(deployer) {
  deployer.deploy(EmploymentContract);
  deployer.deploy(EmployeeContract);
};
