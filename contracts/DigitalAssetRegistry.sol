// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDigitalAssetRegistry {
    // Events
    event AssetRegistered(bytes32 indexed assetHash, address indexed owner, uint256 timestamp);
    event OwnershipTransferred(bytes32 indexed assetHash, address indexed previousOwner, address indexed newOwner);
    event AssetMetadataUpdated(bytes32 indexed assetHash, string newMetadata);
    
    // Core functions
    function registerAsset(bytes32 _assetHash, string memory _metadata) external;
    function verifyAsset(bytes32 _assetHash) external view returns (bytes32 assetHash, address owner, uint256 registrationTime, string memory metadata);
    function assetExists(bytes32 _assetHash) external view returns (bool);
    function transferOwnership(bytes32 _assetHash, address _newOwner) external;
    function updateMetadata(bytes32 _assetHash, string memory _newMetadata) external;
    function getAssetOwner(bytes32 _assetHash) external view returns (address);
    
    // Advanced functions
    function batchRegisterAssets(bytes32[] calldata _assetHashes, string[] calldata _metadataArray) external;
    function getAssetsByOwner(address _owner) external view returns (bytes32[] memory);
    function getAssetCountByOwner(address _owner) external view returns (uint256);
    function batchTransferOwnership(bytes32[] calldata _assetHashes, address _newOwner) external;
    function batchGetAssetDetails(bytes32[] calldata _assetHashes) external view returns (address[] memory ownerAddresses, uint256[] memory registrationTimes, string[] memory metadataArray);
}