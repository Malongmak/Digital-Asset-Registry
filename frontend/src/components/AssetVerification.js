import React, { useState } from 'react';
import { ethers } from 'ethers';

function AssetVerification({ contract }) {
  const [assetId, setAssetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!assetId) {
      setError("Please enter an asset ID");
      return;
    }

    try {
      setLoading(true);
      setAsset(null);
      setError(null);
      
      // Convert the asset ID to bytes32 hash
      const assetHash = ethers.utils.id(assetId);
      
      // Verify the asset
      const assetData = await contract.verifyAsset(assetHash);
      
      setAsset({
        hash: assetData.assetHash,
        owner: assetData.owner,
        registrationTime: new Date(assetData.registrationTime.toNumber() * 1000).toLocaleString(),
        metadata: assetData.metadata
      });
    } catch (err) {
      console.error("Verification error:", err);
      setError("Asset not found or another error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">Verify Asset</h2>
      
      <form onSubmit={handleVerify}>
        <div className="mb-3">
          <label htmlFor="verifyAssetId" className="form-label">Asset ID or Name</label>
          <input
            type="text"
            className="form-control"
            id="verifyAssetId"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter the asset ID to verify"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !assetId}
        >
          {loading ? 'Verifying...' : 'Verify Asset'}
        </button>
      </form>
      
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
      
      {asset && (
        <div className="mt-4">
          <h3>Asset Details</h3>
          <div className="card p-3">
            <div className="mb-2">
              <strong>Owner:</strong> {asset.owner}
            </div>
            <div className="mb-2">
              <strong>Registration Time:</strong> {asset.registrationTime}
            </div>
            <div className="mb-2">
              <strong>Metadata:</strong>
              <p className="mt-1">{asset.metadata}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetVerification;