pragma solidity ^0.4.2;
import "./ConvertLib.sol";
// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!
contract MetaCoin {
struct Job {
    address employeeAddr;
        address employerAddr;
    uint totalAmount;
        uint dailyAmount;
        uint state;//0 - started, 1 - daily salary started, 2 - completed
        uint remainingDays;
  }
    uint jobsCount;
    mapping (uint => Job) jobs;
    mapping (address => uint) balances;
    address escrowAccount;
    //for the time being lets assume that an employee can
    //have only one employer at a time
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    function addEmployee(address emAddr) returns(bool added)
    {
        balances[emAddr] = 200;
        return true;
    }
    function addEmployer(address emAddr) returns(bool added)
    {
        balances[emAddr] = 500;
        return true;
    }
    function jobReceived(address employer, address  employee, uint totalJobSalary,
        uint jobDailySalary) returns(bool added)
    {
    Job memory j = Job(employee, employer, totalJobSalary, jobDailySalary ,0, 10);
    jobs[jobsCount] = j;
    jobsCount++;
    sendCoin(employer, escrowAccount, totalJobSalary);
        return true;
    }
    function jobDailyUpdate(bool jobDoneForDay, uint jobId) returns(bool updated)
    {
    sendSalary(jobId);
        return true;
    }
    function getEmployee(uint jobId) returns(address employerAddr)
    {
        return jobs[jobId].employeeAddr;
    }
    function MetaCoin() {
        balances[tx.origin] = 10000;
        balances[escrowAccount] = 0;
        jobsCount = 10;
        escrowAccount = 0x4a3b5d4a8bc2a40d73c97a329ba8b76755a529b7;
    }
    function sendSalary(uint jobId) returns(bool sufficient) {
        var j = jobs[jobId];
        sendCoin(escrowAccount , j.employeeAddr, j.dailyAmount);
            return true;
    }
    function sendCoin(address sender, address receiver, uint amount) returns(bool sufficient) {
        if (balances[sender] < amount) return false;
            balances[sender] -= amount;
            balances[receiver] += amount;
            Transfer(sender, receiver, amount);
            return true;
    }
    function getBalanceInEth(address addr) returns(uint){
        return ConvertLib.convert(getBalance(addr),2);
    }
    function getBalance(address addr) returns(uint) {
        return balances[addr];
    }
}