pragma solidity ^0.4.2;

import "./JobContract.sol";

contract EmploymentContractFactory {

    mapping (address => JobContract) contracts;

    function newEmployment() public returns (address newContract) {
        JobContract employment = new JobContract();
        contracts[msg.sender] = employment;
        return employment;
    }

    function getEmploymentContract() public returns (JobContract employment) {
        return contracts[msg.sender];
    }

}