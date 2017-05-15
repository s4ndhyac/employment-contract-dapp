pragma solidity ^0.4.2;

contract EmployeeContract {

    struct Employee {
        uint employeeID;
        address  employee;
        bytes32  name;
        bytes32  skill;
        uint  balance;
    }

    mapping (uint => Employee) employees;
    uint numEmployees;

    function createEmployee(address employeeAddress, bytes32 name, bytes32 skill) returns (uint) {
        employees[numEmployees] = Employee(numEmployees,employeeAddress,name,skill,0);
        numEmployees++;
        return numEmployees;
    }

    function getEmployee(uint employeeID) constant returns (address, bytes32, bytes32, uint) {
        return (employees[employeeID].employee, employees[employeeID].name, employees[employeeID].skill, employees[employeeID].balance);
    }

    function returnEmployeeCount() constant returns (uint empCount) {
        return numEmployees;
    }

}