pragma solidity ^0.4.2;

contract EmploymentContract {

    struct Terms {
        uint dailySalary;
        uint contractDays;
    }

    mapping (address => Terms) employmentContracts;

    mapping (address=>uint) balances;

    address public employer;

    function EmploymentContract() {
        employer = msg.sender;
        balances[msg.sender] = 10000;
    }

    function addContract(address employee, uint amount, uint contractDays) {
        employmentContracts[employee] = Terms(amount, contractDays);
    }

    function removeContract(address employee) {
        delete employmentContracts[employee];
    }

    function getContract(address employee) constant returns (uint dailySalary, uint contractDays) {   
        return (employmentContracts[employee].dailySalary, employmentContracts[employee].contractDays);
    }

    function sendCoin(address receiver, uint amount) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		return true;
	}

    function getBalance(address addr) returns(uint) {
  	    return balances[addr];
	}

    function checkBalance(address addr) returns(uint balance) {
        return balances[addr];
    }

}