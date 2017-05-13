// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import employment_contract from '../../build/contracts/EmploymentContract.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var EmploymentContract = contract(employment_contract);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    EmploymentContract.setProvider(web3.currentProvider);

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

  refreshBalance: function() {
    var self = this;
    var emp;
    EmploymentContract.deployed().then(function(instance) {
      emp = instance;
      return emp.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  checkBalance: function() {
    var employeeAddress = document.getElementById("empBalanceAdd").value;
    console.log(employeeAddress);
    document.getElementById("empBalanceAdd").value='';
    var emp;
    EmploymentContract.deployed().then(function(instance) {
      emp = instance;
      return emp.checkBalance.call(employeeAddress,{from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("empBalance");
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

    this.setStatus("Creating contract");

    var emp;
    EmploymentContract.deployed().then(function(instance) {
      emp = instance;
      
      return emp.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  },

    addContract: function() {
    var employeeAddress = document.getElementById("employeeAddress").value;
    console.log(employeeAddress);
    var employeeSalary = document.getElementById("employeeSalary").value;
    console.log(employeeSalary);
    var emp;
    EmploymentContract.deployed().then(function(instance) {
      emp = instance;
      return emp.addContract(employeeAddress,employeeSalary,{from: account});
    }).then(function() {
        })
        .catch(function(error) {
            console.error(error);
        });
    },

    getContract: function() {
    var employeeAddress = document.getElementById("empAddress").value;
    console.log(employeeAddress);
    document.getElementById("empAddress").value='';
    var emp;
    EmploymentContract.deployed().then(function(instance) {
      emp = instance;
      return emp.getContract(employeeAddress);
    }).then(function(salary) {
      var empsalary_element = document.getElementById("getSalary");
      empsalary_element.innerHTML = salary.valueOf();
        })
        .catch(function(error) {
            console.error(error);
        });
    },

    removeContract: function() {
    var employeeAddress = document.getElementById("removeAddress").value;
    console.log(employeeAddress);
    var emp;
    EmploymentContract.deployed().then(function(instance) {
      emp = instance;
      return emp.removeContract(employeeAddress,{from: account, gas: 4712388, gasPrice: 100000000000});
    }).then(function() {
        })
        .catch(function(error) {
            console.error(error);
        });
    }

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
