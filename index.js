require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const vaultsRouter = require('./routes/vaults');
const contractRouter = require('./routes/contract');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mock Vault API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      vaults: '/vaults',
      vault_bars: '/vaults/:vault_id/bars',
      vault_reserve: '/vaults/:vault_id/vault_reserve',
      contract_vault_ounces: '/contract/vault-ounces',
      contract_info: '/contract/info',
      health: '/health',
      swagger: '/api-docs'
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 */
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API Routes
app.use('/vaults', vaultsRouter);
app.use('/contract', contractRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Only start server if not in serverless environment (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
