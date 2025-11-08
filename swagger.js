const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mock Vault API',
      version: '1.0.0',
      description: 'API for managing gold bars in vaults with filtering and querying capabilities',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Vaults',
        description: 'Vault management endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
