import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AssetRegistration from './components/AssetRegistration';
import AssetVerification from './components/AssetVerification';
import AssetTransfer from './components/AssetTransfer';
import { connectWallet, getContract } from './utils/contractInteraction';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('register');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const { signer, contractInstance } = await connectWallet();
        
        if (signer) {
          const address = await signer.getAddress();
          setAccount(address);
          setContract(contractInstance);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { signer, contractInstance } = await connectWallet();
      
      if (signer) {
        const address = await signer.getAddress();
        setAccount(address);
        setContract(contractInstance);
      }
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Digital Asset Registry</h1>
      
      {account ? (
        <div className="mb-3 text-center">
          <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
        </div>
      ) : (
        <div className="text-center mb-4">
          <button 
            className="btn btn-primary" 
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}

      {account && contract && (
        <>
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register Asset
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'verify' ? 'active' : ''}`}
                onClick={() => setActiveTab('verify')}
              >
                Verify Asset
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'transfer' ? 'active' : ''}`}
                onClick={() => setActiveTab('transfer')}
              >
                Transfer Ownership
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === 'register' && (
              <AssetRegistration contract={contract} account={account} />
            )}
            {activeTab === 'verify' && (
              <AssetVerification contract={contract} />
            )}
            {activeTab === 'transfer' && (
              <AssetTransfer contract={contract} account={account} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;