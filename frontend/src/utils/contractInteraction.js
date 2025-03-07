import { ethers } from 'ethers';
import DigitalAssetRegistryABI from '../artifacts/contracts/DigitalAssetRegistry.sol/DigitalAssetRegistry.json';

// Contract address - this should be updated after deployment
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Example local hardhat address

/**
 * Connect to the user's Ethereum wallet
 * @returns {Promise<{provider: ethers.providers.Web3Provider, signer: ethers.Signer, contractInstance: ethers.Contract}>}
 */
export const connectWallet = async () => {
  // Check if MetaMask is installed
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create ethers provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Create contract instance
    const contractInstance = new ethers.Contract(
      CONTRACT_ADDRESS,
      DigitalAssetRegistryABI.abi,
      signer
    );
    
    return { provider, signer, contractInstance };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

/**
 * Get contract instance
 * @param {boolean} requireSigner - Whether to return a contract instance with a signer
 * @returns {Promise<ethers.Contract>}
 */
export const getContract = async (requireSigner = true) => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  if (requireSigner) {
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, DigitalAssetRegistryABI.abi, signer);
  } else {
    return new ethers.Contract(CONTRACT_ADDRESS, DigitalAssetRegistryABI.abi, provider);
  }
};