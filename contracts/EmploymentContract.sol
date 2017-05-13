pragma solidity ^0.4.2;

contract EmploymentContract {
    address public employer;
    mapping (address => uint) private balances;
    address public employee;
    uint public salary;
    uint public daysPaid;

    //log tansfer event
    event LogTransfer(address accountAddress, uint amount);

    //Constructor
    function(){
        employer = msg.sender;
        employee = 0x93a53907765b3296c57c38a69a1dd0bada6321bb
        salary = 0
    }

    function transfer public returns (uint) {
        balances[msg.sender] -= msg.value
        LogTransfer(msg.sender,msg.value)
        return balances[msg.sender]
    }

    function payDailySalary(uint days) public {
        employee.send(salary/30*days);
        daysPaid++;
    }

    function setSalary(uint salary_decided) public {
        salary = salary_decided
    }
}