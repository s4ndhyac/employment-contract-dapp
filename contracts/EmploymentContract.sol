pragma solidity ^0.4.2;

contract EmploymentContract {

    struct Terms {
        uint dailySalary;
        uint contractDays;
        uint numRatings;
        mapping (uint => uint) ratings; 
    }

    mapping (address => Terms) employmentContracts;

    mapping (address=>uint) balances;

    address public escrow;

    address public employer;

    event Transaction(address sender, address receiver, uint amount, uint time);
    event Rating(address giver, address receiver, uint rate, uint time);

    function EmploymentContract() {
        employer = tx.origin;
        balances[tx.origin] = 10000;
        escrow = 0xfb230af80ac1b1df8219581d870c10ef2a2af8be;
    }

    function addContract(address employee, uint amount, uint contractDays) returns(bool added) {
        var totalAmount = amount * contractDays;
        if(!sendCoin(escrow,totalAmount)) return false;
        employmentContracts[employee] = Terms(amount, contractDays,0);
    }

    function removeContract(address employee) {
        delete employmentContracts[employee];
    }

    function getContract(address employee) constant returns (uint dailySalary, uint contractDays) {   
        return (employmentContracts[employee].dailySalary, employmentContracts[employee].contractDays);
    }

    function sendCoin(address receiver, uint amount) returns(bool sufficient) {
		if (balances[tx.origin] < amount) return false;
		balances[tx.origin] -= amount;
		balances[receiver] += amount;
        Transaction(tx.origin,receiver,amount,now);
		return true;
	}

    function genericSendCoin(address sender, address receiver, uint amount) returns(bool sufficient) {
		if (balances[sender] < amount) return false;
		balances[sender] -= amount;
		balances[receiver] += amount;
        Transaction(escrow,receiver,amount,now);
		return true;
	}

    function getBalance(address addr) returns(uint) {
  	    return balances[addr];
	}

    function checkBalance(address addr) returns(uint balance) {
        return balances[addr];
    }

    function addRating(address employeeAddr, uint rating) returns (uint) {
        employmentContracts[employeeAddr].ratings[employmentContracts[employeeAddr].numRatings] = rating;
        genericSendCoin(escrow, employeeAddr, employmentContracts[employeeAddr].dailySalary);
        employmentContracts[employeeAddr].numRatings++;
        Rating(tx.origin,employeeAddr,rating,now);
        return employmentContracts[employeeAddr].numRatings;
    }

    function getRatingNum(address addr) returns(uint ratingNum) {
        return employmentContracts[addr].numRatings;
    }

}