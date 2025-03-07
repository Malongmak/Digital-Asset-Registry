// Interaction script for DigitalAssetRegistry
const { ethers } = require("hardhat");

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();
  
  console.log("Interacting with contracts with the account:", deployer.address);
  
  // Get the deployed contract
  const DigitalAssetRegistry = await ethers.getContractFactory("DigitalAssetRegistry");
  const registry = await DigitalAssetRegistry.attach("<DEPLOYED_CONTRACT_ADDRESS>");
  
  console.log("Contract address:", registry.address);
  
  // Register a sample asset
  const assetId = "Sample Asset 1";
  const assetHash = ethers.utils.id(assetId); // Create a hash from the asset ID
  const metadata = "This is a sample digital asset for demonstration purposes.";
  
  console.log(`\nRegistering asset with ID: ${assetId}`);
  console.log(`Hash: ${assetHash}`);
  
  const tx1 = await registry.registerAsset(assetHash, metadata);
  await tx1.wait();
  console.log("Asset registered successfully");
  
  // Verify the asset details
  console.log("\nVerifying asset details...");
  const assetDetails = await registry.verifyAsset(assetHash);
  
  console.log("Asset Details:");
  console.log("- Hash:", assetDetails.assetHash);
  console.log("- Owner:", assetDetails.owner);
  console.log("- Registration Time:", new Date(assetDetails.registrationTime.toNumber() * 1000).toLocaleString());
  console.log("- Metadata:", assetDetails.metadata);
  
  // Transfer ownership to another address
  console.log(`\nTransferring ownership to ${user1.address}...`);
  const tx2 = await registry.transferOwnership(assetHash, user1.address);
  await tx2.wait();
  
  // Verify the new owner
  const newOwner = await registry.getAssetOwner(assetHash);
  console.log("New owner:", newOwner);
  
  if (newOwner === user1.address) {
    console.log("Ownership transfer successful");
  } else {
    console.log("Ownership transfer failed");
  }
  
  // Get assets by owner
  console.log("\nGetting assets owned by:", user1.address);
  const userAssets = await registry.getAssetsByOwner(user1.address);
  console.log("Assets:", userAssets);
  
  // Update metadata (from user1's account)
  console.log("\nUpdating asset metadata...");
  const newMetadata = "Updated metadata for the sample asset";
  const registryAsUser1 = registry.connect(user1);
  
  const tx3 = await registryAsUser1.updateMetadata(assetHash, newMetadata);
  await tx3.wait();
  
  // Verify the updated metadata
  const updatedAsset = await registry.verifyAsset(assetHash);
  console.log("Updated metadata:", updatedAsset.metadata);
  
  console.log("\nInteraction script completed successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });