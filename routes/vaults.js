const express = require('express');
const router = express.Router();
const { vaults } = require('../data/mockData');
const { getVaultOunces } = require('../utils/contractReader');

/**
 * @swagger
 * /vaults/{vault_id}/bars:
 *   get:
 *     summary: Get all bars in a vault
 *     description: Return all bars currently stored in a vault, with optional filtering
 *     tags: [Vaults]
 *     parameters:
 *       - in: path
 *         name: vault_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vault identifier (e.g., ZH-001, ZH-002, NY-001)
 *       - in: query
 *         name: owner_id
 *         schema:
 *           type: string
 *         description: Filter by current owner
 *       - in: query
 *         name: owner_status
 *         schema:
 *           type: string
 *           enum: [assigned, unassigned, awaiting_mint, pending_delivery]
 *         description: Filter by owner status
 *       - in: query
 *         name: purity_min
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum purity filter
 *       - in: query
 *         name: purity_max
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum purity filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of results to skip (for pagination)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vault_id:
 *                   type: string
 *                 total_bars:
 *                   type: integer
 *                 total_weight_grams:
 *                   type: number
 *                 total_oz:
 *                   type: number
 *                 bars:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       record_id:
 *                         type: integer
 *                       serial_number:
 *                         type: string
 *                       weight_grams:
 *                         type: number
 *                       purity:
 *                         type: number
 *                       delivery_date:
 *                         type: string
 *                       owner_id:
 *                         type: string
 *                       owner_status:
 *                         type: string
 *       404:
 *         description: Vault not found
 */
router.get('/:vault_id/bars', (req, res) => {
  const { vault_id } = req.params;
  const {
    owner_id,
    owner_status,
    purity_min,
    purity_max,
    limit,
    offset
  } = req.query;

  // Check if vault exists
  if (!vaults[vault_id]) {
    return res.status(404).json({
      error: 'Vault not found',
      vault_id
    });
  }

  let bars = [...vaults[vault_id]];

  // Apply filters
  if (owner_id) {
    bars = bars.filter(bar => bar.owner_id === owner_id);
  }

  if (owner_status) {
    bars = bars.filter(bar => bar.owner_status === owner_status);
  }

  if (purity_min) {
    const minPurity = parseFloat(purity_min);
    if (!isNaN(minPurity)) {
      bars = bars.filter(bar => bar.purity >= minPurity);
    }
  }

  if (purity_max) {
    const maxPurity = parseFloat(purity_max);
    if (!isNaN(maxPurity)) {
      bars = bars.filter(bar => bar.purity <= maxPurity);
    }
  }

  // Calculate total bars before pagination
  const total_bars = bars.length;

  // Apply pagination
  const offsetNum = parseInt(offset) || 0;
  const limitNum = parseInt(limit) || bars.length;
  
  bars = bars.slice(offsetNum, offsetNum + limitNum);

  // Calculate total oz (troy ounces)
  // 1 troy ounce = 31.1034768 grams
  const total_weight_grams = bars.reduce((sum, bar) => sum + bar.weight_grams, 0);
  const total_oz = total_weight_grams / 31.1034768;

  res.json({
    vault_id,
    total_bars,
    total_weight_grams: parseFloat(total_weight_grams.toFixed(2)),
    total_oz: parseFloat(total_oz.toFixed(4)),
    bars
  });
});

/**
 * @swagger
 * /vaults/{vault_id}/vault_reserve:
 *   get:
 *     summary: Get vault reserve information
 *     description: Return vault reserve with total oz from smart contract and calculated weight in grams
 *     tags: [Vaults]
 *     parameters:
 *       - in: path
 *         name: vault_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vault identifier (e.g., ZH-001, ZH-002, NY-001)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vault_id:
 *                   type: string
 *                   example: ZH-001
 *                 total_bars:
 *                   type: integer
 *                   example: 42
 *                 total_weight_grams:
 *                   type: number
 *                   example: 45678
 *                 total_weight_oz:
 *                   type: number
 *                   example: 1610.6657
 *                   description: Total oz from smart contract
 *                 contract_source:
 *                   type: boolean
 *                   description: Whether data came from contract (true) or fallback (false)
 *       404:
 *         description: Vault not found
 */
router.get('/:vault_id/vault_reserve', async (req, res) => {
  const { vault_id } = req.params;

  // Check if vault exists
  if (!vaults[vault_id]) {
    return res.status(404).json({
      error: 'Vault not found',
      vault_id
    });
  }

  try {
    // Get total oz from smart contract
    const contractData = await getVaultOunces();
    const total_weight_oz = parseFloat(contractData.formatted);
    
    // Calculate total weight in grams from contract oz
    // 1 troy ounce = 31.1034768 grams
    const total_weight_grams = total_weight_oz * 31.1034768;

    // Generate random total_bars (keeping this as random)
    const total_bars = Math.floor(Math.random() * 100) + 1;

    res.json({
      vault_id,
      total_bars,
      total_weight_grams: parseFloat(total_weight_grams.toFixed(2)),
      total_weight_oz: parseFloat(total_weight_oz.toFixed(4)),
      contract_source: true
    });
  } catch (error) {
    // Fallback to random data if contract call fails
    const total_bars = Math.floor(Math.random() * 100) + 1;
    const total_weight_grams = Math.floor(Math.random() * 100000) + 1000;
    const total_weight_oz = parseFloat((total_weight_grams * 0.035274).toFixed(4));

    res.json({
      vault_id,
      total_bars,
      total_weight_grams,
      total_weight_oz,
      contract_source: false,
      error: 'Using fallback calculation - contract unavailable'
    });
  }
});

/**
 * @swagger
 * /vaults:
 *   get:
 *     summary: List all vaults
 *     description: Get a list of all available vaults with summary information
 *     tags: [Vaults]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_vaults:
 *                   type: integer
 *                 vaults:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vault_id:
 *                         type: string
 *                       total_bars:
 *                         type: integer
 *                       total_weight_grams:
 *                         type: number
 */
router.get('/', (req, res) => {
  const vaultList = Object.keys(vaults).map(vault_id => ({
    vault_id,
    total_bars: vaults[vault_id].length,
    total_weight_grams: vaults[vault_id].reduce((sum, bar) => sum + bar.weight_grams, 0)
  }));

  res.json({
    total_vaults: vaultList.length,
    vaults: vaultList
  });
});

module.exports = router;
