import React, { useState } from 'react';
import { ethers } from 'ethers';

function AssetRegistration({ contract, account }) {
  const [assetId, setAssetId] = useState('');
  const [metadata, setMetadata] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!assetId || !metadata) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setError(null);
      
      // Convert the asset ID to bytes32 hash
      const assetHash = ethers.utils.id(assetId);
      
      // Register the asset
      const tx = await contract.registerAsset(assetHash, metadata);
      await tx.wait();
      
      setResult({
        success: true,
        message: `Asset registered successfully with ID: ${assetId}`,
        hash: tx.hash
      });
      
      // Clear form
      setAssetId('');
      setMetadata('');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">Register New Asset</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="assetId" className="form-label">Asset ID or Name</label>
          <input
            type="text"
            className="form-control"
            id="assetId"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter a unique identifier for your asset"
            disabled={loading}
          />
          <small className="text-muted">This will be hashed to create a unique identifier</small>
        </div>
        
        <div className="mb-3">
          <label htmlFor="metadata" className="form-label">Asset Metadata</label>
          <textarea
            className="form-control"
            id="metadata"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder="Description, attributes, or any other relevant information"
            rows="4"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !assetId || !metadata}
        >
          {loading ? 'Registering...' : 'Register Asset'}
        </button>
      </form>
      
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
      
      {result && result.success && (
        <div className="alert alert-success mt-3">
          <p>{result.message}</p>
          <small>Transaction: {result.hash}</small>
        </div>
      )}
    </div>
  );
}

export default AssetRegistration;