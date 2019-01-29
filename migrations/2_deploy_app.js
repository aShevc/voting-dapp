const Election = artifacts.require('Election')

module.exports = function(deployer, network, [owner]) {
    return deployer.deploy(Election);
}