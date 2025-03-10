async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const DigitalAssetRegistry = await ethers.getContractFactory("DigitalAssetRegistry");
    const registry = await DigitalAssetRegistry.deploy();
    
    await registry.deployed();
    
    console.log("DigitalAssetRegistry deployed to:", registry.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });