pragma solidity ^0.4.2;

contract EmployeeContract {

    struct Employee {
        uint employeeID;
        address  employee;
        bytes32  name;
        bytes32  skill;
        uint role;
    }

    mapping (uint => Employee) employees;
    uint numEmployees;

    function createEmployee(bytes32 name, bytes32 skill, uint role) returns (uint) {
        employees[numEmployees] = Employee(numEmployees,msg.sender,name,skill,role);
        numEmployees++;
        return numEmployees;
    }

    function getEmployee(uint employeeID) constant returns (address, bytes32, bytes32, uint) {
        return (employees[employeeID].employee, employees[employeeID].name, employees[employeeID].skill, employees[employeeID].role);
    }

    function returnEmployeeCount() constant returns (uint empCount) {
        return numEmployees;
    }

}