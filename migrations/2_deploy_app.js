const Election = artifacts.require('ElectionV1')
const ElectionStorage = artifacts.require('ElectionStorage')

module.exports = function(deployer, network, [owner]) {
    return deployer
        .then(() => deployElectionStorage(deployer))
        .then(() => deployElection(deployer))
        .then(() => setAuthorizedElectionContract(deployer));
}

function deployElectionStorage(deployer) {
    return deployer.deploy(ElectionStorage)
}

function deployElection(deployer) {
    return deployer.deploy(Election, ElectionStorage.address)
}

async function setAuthorizedElectionContract() {
    return (await ElectionStorage.deployed()).addAuthorizedContract(Election.address)
}