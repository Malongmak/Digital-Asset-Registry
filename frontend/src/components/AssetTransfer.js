import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function AssetTransfer({ contract, account }) {
  const [assetId, setAssetId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [assets, setAssets] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssets = async () => {
      if (contract && account) {
        try {
          setLoading(true);
          
          // Get assets owned by the connected account
          const assetHashes = await contract.getAssetsByOwner(account);
          
          if (assetHashes.length > 0) {
            // Get details for each asset
            const details = await Promise.all(
              assetHashes.map(async (hash) => {
                try {
                  const data = await contract.verifyAsset(hash);
                  return {
                    hash: data.assetHash,
                    metadata: data.metadata,
                    registrationTime: new Date(data.registrationTime.toNumber() * 1000).toLocaleString()
                  };
                } catch (err) {
                  console.error("Error fetching asset:", err);
                  return null;
                }
              })
            );
            
            setAssets(details.filter(d => d !== null));
          } else {
            setAssets([]);
          }
        } catch (err) {
          console.error("Error loading assets:", err);
          setError("Failed to load your assets");
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadAssets();
  }, [contract, account]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!assetId || !newOwner) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setTransferring(true);
      setResult(null);
      setError(null);
      
      // Convert the asset ID to bytes32 hash if needed
      let assetHash;
      if (assetId.startsWith('0x') && assetId.length === 66) {
        assetHash = assetId;
      } else {
        assetHash = ethers.utils.id(assetId);
      }
      
      // Validate the new owner address
      if (!ethers.utils.isAddress(newOwner)) {
        throw new Error("Invalid address format");
      }
      
      // Transfer ownership
      const tx = await contract.transferOwnership(assetHash, newOwner);
      await tx.wait();
      
      // Update the UI
      setResult({
        success: true,
        message: `Asset transferred successfully to ${newOwner}`,
        hash: tx.hash
      });
      
      // Remove the transferred asset from the list
      setAssets(assets.filter(asset => asset.hash !== assetHash));
      
      // Clear form
      setAssetId('');
      setNewOwner('');
    } catch (err) {
      console.error("Transfer error:", err);
      setError(err.message || "Failed to transfer asset");
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">Transfer Asset Ownership</h2>
      
      {loading ? (
        <p>Loading your assets...</p>
      ) : assets.length === 0 ? (
        <div className="alert alert-info mb-4">
          You don't have any registered assets to transfer.
        </div>
      ) : (
        <div className="mb-4">
          <h5>Your Assets</h5>
          <div className="list-group">
            {assets.map((asset, index) => (
              <button
                key={index}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => setAssetId(asset.hash)}
              >
                <div><strong>Metadata:</strong> {asset.metadata}</div>
                <small>Registered: {asset.registrationTime}</small>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleTransfer}>
        <div className="mb-3">
          <label htmlFor="assetIdTransfer" className="form-label">Asset Hash</label>
          <input
            type="text"
            className="form-control"
            id="assetIdTransfer"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter the asset hash to transfer"
            disabled={transferring}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="newOwner" className="form-label">New Owner Address</label>
          <input
            type="text"
            className="form-control"
            id="newOwner"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="Enter the new owner's Ethereum address"
            disabled={transferring}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={transferring || !assetId || !newOwner}
        >
          {transferring ? 'Transferring...' : 'Transfer Ownership'}
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

export default AssetTransfer;