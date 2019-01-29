const Election = artifacts.require('ElectionV2')
const ElectionStorage = artifacts.require('ElectionStorage')

module.exports = function(deployer, network, [owner]) {
    return deployer
        .then(() => deployElection(deployer))
        .then(() => setAuthorizedElectionContract(deployer));
}

function deployElection(deployer) {
    return deployer.deploy(Election, ElectionStorage.address)
}

async function setAuthorizedElectionContract() {
    return (await ElectionStorage.deployed()).addAuthorizedContract(Election.address)
}