// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import JobContract_artifacts from '../../build/contracts/JobContract.json'
import employee_contract from '../../build/contracts/EmployeeContract.json'
import employment_factory_contract from '../../build/contracts/EmploymentContractFactory.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.

var JobContract = contract(JobContract_artifacts);
var EmployeeContract = contract(employee_contract);
var EmploymentFactoryContract = contract(employment_factory_contract);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

// const abiDecoder = require('abi-decoder');
// const abiData = [{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"jobId","type":"int256"}],"name":"lastDayForMarkedAttendance","outputs":[{"name":"day","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"jobId","type":"int256"}],"name":"getEmployee","outputs":[{"name":"employerAddr","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"rating","type":"int256"},{"name":"jobId","type":"int256"}],"name":"jobDailyUpdate","outputs":[{"name":"updated","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"jobId","type":"int256"}],"name":"sendSalary","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"employee","type":"address"},{"name":"totalJobSalary","type":"uint256"},{"name":"jobDailySalary","type":"uint256"},{"name":"jobDays","type":"int256"}],"name":"jobReceived","outputs":[{"name":"added","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"jobId","type":"int256"}],"name":"pullSalary","outputs":[{"name":"salaryPulled","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"jobId","type":"int256"}],"name":"lastDayForReleasedSalary","outputs":[{"name":"day","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"employer","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"jobId","type":"int256"}],"name":"getJobDetails","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"employee","type":"address"},{"name":"totalJobSalary","type":"uint256"},{"name":"jobDailySalary","type":"uint256"},{"name":"jobDays","type":"int256"}],"name":"initializeJob","outputs":[{"name":"added","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_time","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"giver","type":"address"},{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"rate","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"Rating","type":"event"}]
// abiDecoder.addABI(abiData);


window.App = {
  start: function() {
    var self = this;

    // Bootstrap the JobContract abstraction for Use.
    JobContract.setProvider(web3.currentProvider);
    EmployeeContract.setProvider(web3.currentProvider);
    EmploymentFactoryContract.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  setTestBox: function(message) {
    var status = document.getElementById("gen");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  getBalance : function(){
    var self = this;

    var meta;
    var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
      var addr = document.getElementById("employerAddr").value;
      return meta.getBalance.call(addr, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("gen");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;
      
    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
      var result = meta.sendCoin(account, receiver, amount, {from: account});
      console.log(result);
      return result;
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  },

    markJobStatusDaily: function() {
    var self = this;

    var jobId = parseInt(document.getElementById("jobId").value);
    //this.setStatus("Adding employee... (please wait)");
    console.log(jobId);
    var meta;
    var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
      var rating = parseInt(document.getElementById("rating").value);
      var result = meta.jobDailyUpdate(rating, jobId, {from: account});
      //console.log("result for adding employee at address " + employeeAddr + "is" + result);
      return result;
    }).then(function() {
      self.setStatus("Added employee!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error adding coin; see log.");
    });
  },

  pullSalary: function() {
    var self = this;

    var jobId = parseInt(document.getElementById("jobId").value);
    //this.setStatus("Adding employee... (please wait)");
    console.log(jobId);
    var meta;
    var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
      var result = meta.pullSalary(jobId, {from: account});
      //console.log("result for adding employee at address " + employeeAddr + "is" + result);
      return result;
    }).then(function() {
      self.setStatus("Added employee!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error adding coin; see log.");
    });
  },
  
  addEmployee: function() {
    var employeeSkill = document.getElementById("addEmployeeSkill").value;
    console.log(employeeSkill);
    var employeeName = document.getElementById("addEmployeeName").value;
    console.log(employeeName);
    var employeeRole = document.getElementById("addEmployeeRole").value;
    console.log(employeeRole);
    var emp;
    EmployeeContract.deployed().then(function(instance) {
      emp = instance;
      return emp.createEmployee(employeeName,employeeSkill,employeeRole,{from: account});
    }).then(function(value) {
      console.log(value.valueOf());
        })
        .catch(function(error) {
            console.error(error);
        });
      var empFactory;
      if(employeeRole==0){
        EmploymentFactoryContract.deployed().then(function(instance) {
          empFactory = instance;
          return empFactory.newEmployment({from: account});
        }).then(function() {
        })
        .catch(function(error) {
            console.error(error);
        });
      }
    },

    getEmployees: function() {
    var employeeCount = document.getElementById("getEmployeeCount").value;
    console.log(employeeCount);
    document.getElementById("getEmployeeCount").value='';
    var emp;
    EmployeeContract.deployed().then(function(instance) {
      emp = instance;
      return emp.getEmployee(employeeCount-1);
    }).then(function(value) {
      var emp_details = document.getElementById("getEmpDetails");
      emp_details.innerHTML = value.valueOf();
        })
        .catch(function(error) {
            console.error(error);
        });
    },


  lastDayForReleasedSalary: function() {
    var self = this;

    var meta;
    var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
      console.log(account);
      var jobId = parseInt(document.getElementById("jobId").value);

      return meta.lastDayForReleasedSalary.call(jobId, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("lastDayForReleasedSalary");
      console.log(value);
      console.log(value.valueOf());
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },


    lastDayForMarkedAttendance: function() {
      var self = this;

      var meta;
      var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
        console.log(account);
        var jobId = parseInt(document.getElementById("jobId").value);

        return meta.lastDayForMarkedAttendance.call(jobId, {from: account});
      }).then(function(value) {
        var balance_element = document.getElementById("lastDayForMarkedAttendance");
        balance_element.innerHTML = value.valueOf();
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting balance; see log.");
      });
    },


        salaryStatus: function() {
          var self = this;

          var meta;
          var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
            console.log(account);
            var jobId = parseInt(document.getElementById("jobId").value);
            var day = parseInt(document.getElementById("day").value);
            console.log(jobId);
            console.log(day);

            return meta.salaryStatus.call(jobId, day, {from: account});

          }).then(function(value) {
            var balance_element = document.getElementById("estatus");
            balance_element.innerHTML = value.valueOf();
          }).catch(function(e) {
            console.log(e);
            self.setStatus("Error getting balance; see log.");
          });
        },


            attendanceStatus: function() {
              var self = this;

              var meta;
              var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
                console.log(account);
                var jobId = parseInt(document.getElementById("jobId").value);
                var day = parseInt(document.getElementById("day").value);
                console.log(jobId);
                console.log(day);
                return meta.feedbackStatus.call(jobId,day, {from: account});
              }).then(function(value) {
                var balance_element = document.getElementById("estatus");
                balance_element.innerHTML = value.valueOf();
              }).catch(function(e) {
                console.log(e);
                self.setStatus("Error getting balance; see log.");
              });
            },
			
			getEmpCount: function() {
    var self = this;
    var emp;
    EmployeeContract.deployed().then(function(instance) {
      emp = instance;
      return emp.returnEmployeeCount.call(account, {from: account});
    }).then(function(value) {
      var emp_count = document.getElementById("empCount");
      emp_count.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting emp count; see log.");
    });
  },
  
      getEmployees: function() {
    var employeeCount = document.getElementById("getEmployeeCount").value;
    console.log(employeeCount);
    document.getElementById("getEmployeeCount").value='';
    var emp;
    EmployeeContract.deployed().then(function(instance) {
      emp = instance;
      return emp.getEmployee(employeeCount-1);
    }).then(function(value) {
      var emp_details = document.getElementById("getEmpDetails");
      emp_details.innerHTML = value.valueOf();
        })
        .catch(function(error) {
            console.error(error);
        });
    },

    getEmployer: function() {
    var emp;
    EmploymentFactoryContract.deployed().then(function(instance) {
      emp = instance;
      return emp.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      var emp_details = document.getElementById("getEmployerDetails");
      emp_details.innerHTML = value.valueOf();
        })
        .catch(function(error) {
            console.error(error);
        });
    },




    addJob: function() {
      var self = this;

      var employeeAddr = document.getElementById("employeeAddr").value;
      var totalJobSalary = parseInt(document.getElementById("jobSalary").value);
      var jobDailySalary = parseInt(document.getElementById("jobDailySalary").value);
      var jobDays = parseInt(document.getElementById("jobDays").value);

      console.log(employeeAddr);
      this.setStatus("Adding job... (please wait)");

      var meta;
      var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
        var result = meta.jobReceived(employeeAddr,totalJobSalary,
          jobDailySalary, jobDays, {from: account, gas: 4712388, gasPrice: 100000000000});
        console.log("result for adding job " + "is" + result);
        return result;
      }).then(function() {
        self.setStatus("Added job!");
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error adding job; see log.");
      });
    },
	
  getTxnHistory: function () {
    var empAddress = document.getElementById('empHistoryAdd').value;
   var status = document.getElementById ('empHistory');
  var meta;
      var empFactory;
    EmploymentFactoryContract.deployed().then(function(instance) {
      empFactory = instance;
      return empFactory.getEmploymentContract.call({from: account});
    }).then(function(value) {
      console.log(value);
      meta = JobContract.at(value);
      meta.Transfer({_to: empAddress},{fromBlock:0, toBlock: 'latest'}).watch((err, response) => {  //set up listener for the AuctionClosed Event
        //once the event has been detected, take actions as desired
        console.log(response);
        status.innerHTML += JSON.stringify(response.args);
      });
    });
  },

	// getTransactionsByAccount: function () {
  //       var myaccount = document.getElementById("empHistoryAdd").value;
  //       console.log(myaccount);
  //       document.getElementById("empHistoryAdd").value='';
  //       web3.eth.getBlockNumber(function(error, result){
  //         if (error != null) {
  //           alert("There was an error fetching end block number");
  //           return;
  //         }
  //         var endBlockNumber = result;
  //         console.log("Using endBlockNumber: " + endBlockNumber);
  //         var startBlockNumber = 0;
  //         console.log("Using startBlockNumber: " + startBlockNumber);
  //         console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
  //         var empHistoryDict = {};
  //         for (var i = startBlockNumber; i <= endBlockNumber; i++) {
  //           if (i % 1000 == 0) {
  //           console.log("Searching block " + i);
  //           }
  //           web3.eth.getBlock(i, true, function(error, result){
  //             if (error != null) {
  //               alert("There was an error fetching end block number");
  //               return;
  //             }
  //             var block = result;
  //             if (block != null && block.transactions != null) {
  //              block.transactions.forEach( function(e) {
  //                console.log(e);
  //                if(e.input != null) {
  //                  console.log(e.input);
  //                     var inputData = abiDecoder.decodeMethod(e.input);
  //                     var inputDataJson = JSON.stringify(inputData);
  //                     console.log(inputDataJson);
  //                     if(inputData != null) {
  //                       if((inputData.name=="sendCoin") && (inputData.params[0].value==myaccount ||inputData.params[1].value==myaccount)) {
  //                       console.log(block.timestamp);
  //                       console.log(inputData.params[1].value);
  //                       empHistoryDict[block.timestamp] = inputData.params[1].value;
  //                       console.log(JSON.stringify(empHistoryDict));
  //                       }
  //                     }
  //                }
  //             })
  //                var history_element = document.getElementById("empHistory");
  //                history_element.innerHTML = JSON.stringify(empHistoryDict);
  //           }
  //          });
  //       }
  //     });
  //   }

};


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 JobContract, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
