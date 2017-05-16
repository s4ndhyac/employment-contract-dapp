pragma solidity ^0.4.2;

import "./EmploymentContract.sol";

contract EmploymentContractFactory {

    mapping (address => EmploymentContract) contracts;

    function newEmployment() public returns (address newContract) {
        EmploymentContract employment = new EmploymentContract();
        contracts[msg.sender] = employment;
        return employment;
    }

    function getEmploymentContract() public returns (EmploymentContract employment) {
        return contracts[msg.sender];
    }

}