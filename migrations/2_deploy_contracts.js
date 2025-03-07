const DigitalAssetRegistry = artifacts.require("DigitalAssetRegistry");

module.exports = function(deployer) {
  deployer.deploy(DigitalAssetRegistry);
};