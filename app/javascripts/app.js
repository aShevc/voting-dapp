import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import election_artifacts from '../../build/contracts/ElectionV2.json'
import election_storage_artifacts from '../../build/contracts/ElectionStorage.json'

import ethUtils from 'ethereumjs-util';

var Election = contract(election_artifacts);
var ElectionStorage = contract(election_storage_artifacts);

var election;
var electionStorage;
var accounts;
var account;

// Were Web3 context provided beforehand. Indicates usage of MetaMask, or similar tools
var isWeb3Provided = false;

window.App = {

  start: function() {
    Election.setProvider(web3.currentProvider);
    ElectionStorage.setProvider(web3.currentProvider);

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

      console.log('Accounts available:' + accounts);

      App.initializeContracts();
    });
  },

  initializeContracts: function() {

      Election.deployed().then((inst) => {
        election = inst;
        window.election = inst;
        return ElectionStorage.deployed();
      }).then((inst) => {
        electionStorage = inst;
        window.electionStorage = inst;

        App.listenForEvents();
        return App.render();
      });
  },

  render: function() {

    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    $("#electionAddress").html(election.address);

    // Load contract data
    electionStorage.candidatesCount().then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionStorage.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();

    election.vote(candidateId, {from: account}).then(function(result) {
        $("#voteCastForm").modal('hide')
        App.render();
    }).catch(function(err) {
      console.error(err);
      App.showVoteAlert("Got an error trying to vote")
    });
  },

  showVoteAlert: function(msg) {
    $('#voteErrorMsg').html(msg)
    $('#voteAlert').addClass('show')
    $('#voteAlert').removeClass('collapse')
  },

  listenForEvents: function() {
    web3.eth.getBlockNumber().then((blockNumber) => {
        election.votedEvent({}, {
            fromBlock: blockNumber
        }).watch(function(error, event) {
            console.log("event triggered", event)
            App.render();
        })
    });
  }
}

export const loadWeb3 = async() => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Accounts now exposed
            isWeb3Provided = true;
        } catch (error) {
            console.warn("User have denied access to Metamask, can't continue")
        }
      } else if (typeof web3 !== 'undefined') {
        console.log("Using web3 detected from external source.")
        // Use Mist/MetaMask's provider
        isWeb3Provided = true;
        window.web3 = new Web3(web3.currentProvider);
      } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      }

      App.start();
};

window.addEventListener('load', loadWeb3);