const { ethers } = require('ethers');
const VaultFaucetAbi = require('../data/VaultFaucetAbi.json');

/**
 * Configuration for the contract
 */
const CONTRACT_CONFIG = {
  address: '0x5313BC6Fca048258aedA94C05b68C17A376Ab555',
  chainId: 11155111, // Sepolia testnet
  rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo' // Public RPC endpoint
};

/**
 * Get vault ounces from the smart contract
 * @returns {Promise<string>} Formatted value with 18 decimals
 */
async function getVaultOunces() {
  try {
    // Create provider
    const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl);
    
    // Create contract instance
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.address,
      VaultFaucetAbi,
      provider
    );
    
    // Call the vaultOunces function
    const vaultOunces = await contract.vaultOunces();
    
    // Format the value with 18 decimals
    const formattedValue = ethers.formatUnits(vaultOunces, 18);
    
    return {
      raw: vaultOunces.toString(),
      formatted: formattedValue,
      decimals: 18
    };
  } catch (error) {
    console.error('Error reading from contract:', error);
    throw error;
  }
}

/**
 * Get current redemption rate from the smart contract
 * @returns {Promise<Object>} Current rate data
 */
async function getCurrentRate() {
  try {
    const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl);
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.address,
      VaultFaucetAbi,
      provider
    );
    
    const currentRate = await contract.currentRate();
    const formattedValue = ethers.formatUnits(currentRate, 18);
    
    return {
      raw: currentRate.toString(),
      formatted: formattedValue,
      decimals: 18
    };
  } catch (error) {
    console.error('Error reading current rate:', error);
    throw error;
  }
}

/**
 * Get fee accumulator address from the smart contract
 * @returns {Promise<string>} Fee accumulator address
 */
async function getFeeAccumulator() {
  try {
    const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl);
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.address,
      VaultFaucetAbi,
      provider
    );
    
    const feeAccumulator = await contract.feeAccumulator();
    
    return {
      address: feeAccumulator
    };
  } catch (error) {
    console.error('Error reading fee accumulator:', error);
    throw error;
  }
}

/**
 * Get collected fees data from the smart contract
 * @returns {Promise<Object>} Fees data
 */
async function getCollectedFees() {
  try {
    const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl);
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.address,
      VaultFaucetAbi,
      provider
    );
    
    const [feeCollected, mintFeesCollected, custodyFeesCollected] = await Promise.all([
      contract.feeCollected(),
      contract.mintFeesCollected(),
      contract.custodyFeesCollected()
    ]);
    
    return {
      feeCollected: {
        raw: feeCollected.toString(),
        formatted: ethers.formatUnits(feeCollected, 18)
      },
      mintFeesCollected: {
        raw: mintFeesCollected.toString(),
        formatted: ethers.formatUnits(mintFeesCollected, 18)
      },
      custodyFeesCollected: {
        raw: custodyFeesCollected.toString(),
        formatted: ethers.formatUnits(custodyFeesCollected, 18)
      }
    };
  } catch (error) {
    console.error('Error reading collected fees:', error);
    throw error;
  }
}

module.exports = {
  getVaultOunces,
  getCurrentRate,
  getFeeAccumulator,
  getCollectedFees,
  CONTRACT_CONFIG
};
