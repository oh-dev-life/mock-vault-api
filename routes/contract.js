const express = require('express');
const router = express.Router();
const {
  getVaultOunces,
  getCurrentRate,
  getFeeAccumulator,
  getCollectedFees,
  CONTRACT_CONFIG
} = require('../utils/contractReader');

/**
 * @swagger
 * /contract/vault-ounces:
 *   get:
 *     summary: Get vault ounces from smart contract
 *     description: Reads the vaultOunces value from the VaultFaucet smart contract
 *     tags: [Contract]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 raw:
 *                   type: string
 *                   description: Raw value from contract
 *                 formatted:
 *                   type: string
 *                   description: Formatted value with 18 decimals
 *                 decimals:
 *                   type: integer
 *                   example: 18
 *       500:
 *         description: Error reading from contract
 */
router.get('/vault-ounces', async (req, res) => {
  try {
    const data = await getVaultOunces();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read vault ounces from contract',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /contract/current-rate:
 *   get:
 *     summary: Get current redemption rate
 *     description: Reads the current redemption rate from the VaultFaucet smart contract
 *     tags: [Contract]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Error reading from contract
 */
router.get('/current-rate', async (req, res) => {
  try {
    const data = await getCurrentRate();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read current rate from contract',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /contract/fee-accumulator:
 *   get:
 *     summary: Get fee accumulator address
 *     description: Reads the fee accumulator address from the VaultFaucet smart contract
 *     tags: [Contract]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Error reading from contract
 */
router.get('/fee-accumulator', async (req, res) => {
  try {
    const data = await getFeeAccumulator();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read fee accumulator from contract',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /contract/collected-fees:
 *   get:
 *     summary: Get all collected fees
 *     description: Reads all fee-related data from the VaultFaucet smart contract
 *     tags: [Contract]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Error reading from contract
 */
router.get('/collected-fees', async (req, res) => {
  try {
    const data = await getCollectedFees();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read collected fees from contract',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /contract/info:
 *   get:
 *     summary: Get contract configuration
 *     description: Returns the contract address, chain ID, and RPC URL being used
 *     tags: [Contract]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/info', (req, res) => {
  res.json({
    contractAddress: CONTRACT_CONFIG.address,
    chainId: CONTRACT_CONFIG.chainId,
    chainName: 'Sepolia Testnet',
    rpcUrl: CONTRACT_CONFIG.rpcUrl
  });
});

module.exports = router;
