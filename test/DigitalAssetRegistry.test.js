const DigitalAssetRegistry = artifacts.require("DigitalAssetRegistry");
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

contract("DigitalAssetRegistry", accounts => {
  const [owner, user1, user2] = accounts;
  const testAssetHash = web3.utils.keccak256("test-asset");
  const testMetadata = "Test Asset Metadata";
  let registry;

  beforeEach(async () => {
    registry = await DigitalAssetRegistry.new({ from: owner });
  });

  describe("Asset Registration", () => {
    it("should register a new asset", async () => {
      const receipt = await registry.registerAsset(testAssetHash, testMetadata, { from: user1 });
      
      expectEvent(receipt, 'AssetRegistered', {
        assetHash: testAssetHash,
        owner: user1
      });
      
      const exists = await registry.assetExists(testAssetHash);
      assert.isTrue(exists, "Asset should exist after registration");
      
      const assetOwner = await registry.getAssetOwner(testAssetHash);
      assert.equal(assetOwner, user1, "Asset owner should be correct");
    });
    
    it("should not allow registering the same asset twice", async () => {
      await registry.registerAsset(testAssetHash, testMetadata, { from: user1 });
      
      await expectRevert(
        registry.registerAsset(testAssetHash, "New metadata", { from: user1 }),
        "AssetAlreadyRegistered"
      );
    });
  });

  describe("Asset Verification", () => {
    beforeEach(async () => {
      await registry.registerAsset(testAssetHash, testMetadata, { from: user1 });
    });
    
    it("should verify an existing asset", async () => {
      const asset = await registry.verifyAsset(testAssetHash);
      
      assert.equal(asset.assetHash, testAssetHash, "Asset hash should match");
      assert.equal(asset.owner, user1, "Asset owner should match");
      assert.equal(asset.metadata, testMetadata, "Asset metadata should match");
    });
    
    it("should revert when verifying a non-existent asset", async () => {
      const nonExistentHash = web3.utils.keccak256("non-existent");
      
      await expectRevert(
        registry.verifyAsset(nonExistentHash),
        "AssetDoesNotExist"
      );
    });
  });

  describe("Ownership Transfer", () => {
    beforeEach(async () => {
      await registry.registerAsset(testAssetHash, testMetadata, { from: user1 });
    });
    
    it("should transfer ownership", async () => {
      const receipt = await registry.transferOwnership(testAssetHash, user2, { from: user1 });
      
      expectEvent(receipt, 'OwnershipTransferred', {
        assetHash: testAssetHash,
        previousOwner: user1,
        newOwner: user2
      });
      
      const newOwner = await registry.getAssetOwner(testAssetHash);
      assert.equal(newOwner, user2, "Ownership should be transferred");
    });
    
    it("should not allow non-owners to transfer ownership", async () => {
      await expectRevert(
        registry.transferOwnership(testAssetHash, user2, { from: user2 }),
        "NotAssetOwner"
      );
    });
  });

  describe("Metadata Update", () => {
    const newMetadata = "Updated Metadata";
    
    beforeEach(async () => {
      await registry.registerAsset(testAssetHash, testMetadata, { from: user1 });
    });
    
    it("should update metadata", async () => {
      const receipt = await registry.updateMetadata(testAssetHash, newMetadata, { from: user1 });
      
      expectEvent(receipt, 'AssetMetadataUpdated', {
        assetHash: testAssetHash,
        newMetadata: newMetadata
      });
      
      const asset = await registry.verifyAsset(testAssetHash);
      assert.equal(asset.metadata, newMetadata, "Metadata should be updated");
    });
    
    it("should not allow non-owners to update metadata", async () => {
      await expectRevert(
        registry.updateMetadata(testAssetHash, newMetadata, { from: user2 }),
        "NotAssetOwner"
      );
    });
  });
});