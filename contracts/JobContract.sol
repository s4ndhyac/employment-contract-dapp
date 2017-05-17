pragma solidity ^0.4.2;

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract JobContract {


struct Job {
    address employeeAddr;
		address employerAddr;
    uint totalAmount;
		uint dailyAmount;
		int state;//0 - started, 1 - daily salary started, 2 - completed
		int jobDays;
		//assumption is that attendance is marked daily
		int lastFeedbackDay;
		int lastSalaryDay;
		uint salaryPaid;
        mapping (int => int) ratings; 
  }

  address public employer;

	int jobsCount;

	mapping (int => Job) jobs;

	mapping (address => uint) balances;

	address escrowAccount;

	//for the time being lets assume that an employee can
	//have only one employer at a time

	event Transfer(address indexed _from, address indexed _to, uint256 _value, uint _time);
    event Rating(address indexed giver, address indexed receiver, uint rate, uint time);

	function initializeJob(address employee, uint totalJobSalary,
		uint jobDailySalary, int jobDays) returns (bool added)
	{
		jobs[jobsCount] = Job({employeeAddr : employee, employerAddr : tx.origin, totalAmount: totalJobSalary,
			dailyAmount : jobDailySalary , state : 0, jobDays : jobDays,
			lastFeedbackDay : 0, lastSalaryDay : 0, salaryPaid : 0});

		jobsCount++;
		return true;
	}


	function jobReceived(address  employee, uint totalJobSalary,
		uint jobDailySalary, int jobDays) returns(bool added)
	{
		if(initializeJob(employee, totalJobSalary, jobDailySalary, jobDays))
		{
			if(sendCoin(employer, escrowAccount, totalJobSalary))
			{
				return true;
			}
			else
			{
				//delete from job agreement list as money wasn't transferred to escrow
				delete jobs[jobsCount-1];
				jobsCount--;
				return false;
			}
		}
		return false;
	}

	function lastDayForReleasedSalary(int jobId) returns (int day)
	{
		return jobs[jobId].lastSalaryDay;
	}

	function getJobDetails(int jobId) returns(uint, uint, int)
	{
		return (jobs[jobId].totalAmount, jobs[jobId].dailyAmount, jobs[jobId].jobDays);
	}

	function lastDayForMarkedAttendance(int jobId) returns (int day)
	{
		return jobs[jobId].lastFeedbackDay;
	}

	function pullSalary(int jobId) returns (bool salaryPulled)
	{
		if(jobs[jobId].lastSalaryDay >= 0 && jobs[jobId].lastSalaryDay < 10)
		{
			if ((jobs[jobId].lastFeedbackDay - jobs[jobId].lastSalaryDay) > 0)
			{
				for(int i = jobs[jobId].lastSalaryDay+ 1; i<= jobs[jobId].lastFeedbackDay; i++)
				{
					sendSalary(jobId);
					jobs[jobId].lastSalaryDay++;
				}
				return true;
			}
			else
				return false;
		}
		else
			return false;
	}

	function jobDailyUpdate(int rating, int jobId) returns(bool updated)
	{
		if(jobs[jobId].state != 2)
		{
			jobs[jobId].lastFeedbackDay++;
            jobs[jobId].ratings[jobs[jobId].lastFeedbackDay] = rating;
			if(rating==0)
				jobs[jobId].lastSalaryDay++;
			return true;
		}
		if(jobs[jobId].lastFeedbackDay == jobs[jobId].jobDays)
		{
			jobs[jobId].state = 2;
			pullSalary(jobId);//release salary
			sendCoin(escrowAccount, jobs[jobId].employerAddr, jobs[jobId].totalAmount - jobs[jobId].salaryPaid);//release money pending in escrow
		}
	}

	function getEmployee(int jobId) returns(address employerAddr)
	{
		return jobs[jobId].employeeAddr;
	}

	function JobContract() {
        employer = tx.origin;
		balances[tx.origin] = 10000;
		jobsCount = 0;
		escrowAccount = 0x37634d163369a2e26cdfb70cd0ddc1636419f181;
		balances[escrowAccount] = 0;
	}

	function sendSalary(int jobId) returns(bool sufficient) {
		sendCoin(escrowAccount , jobs[jobId].employeeAddr, jobs[jobId].dailyAmount);
		jobs[jobId].salaryPaid += jobs[jobId].dailyAmount;
		return true;
	}

	function sendCoin(address sender, address receiver, uint amount) returns(bool sufficient) {
		if (balances[sender] < amount) return false;
			balances[sender] -= amount;
			balances[receiver] += amount;
			Transfer(sender, receiver, amount, now);
			return true;
	}

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}
}
