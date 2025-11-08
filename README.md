# Mock Vault API

A Node.js API for managing gold bars in vaults with filtering and querying capabilities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` and adjust values as needed
   - Default port is 3000

3. Run the application:

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

4. Access Swagger documentation:
   - Open your browser and go to: **http://localhost:3000/api-docs**
   - Interactive API testing interface with all endpoints documented

## API Documentation

### Swagger UI
Access the interactive API documentation at: **http://localhost:3000/api-docs**

The Swagger interface allows you to:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Try different query parameters and filters

## API Endpoints

### General
- `GET /` - Welcome message with available endpoints
- `GET /health` - Health check endpoint

### Vaults
- `GET /vaults` - List all available vaults
- `GET /vaults/:vault_id/bars` - Get all bars in a specific vault
- `GET /vaults/:vault_id/vault_reserve` - Get vault reserve with random data

## Vault Reserve Endpoint

### `GET /vaults/:vault_id/vault_reserve`

Returns vault reserve information with randomly generated data.

**Path Parameters:**
- `vault_id` - The vault identifier (e.g., `ZH-001`, `ZH-002`, `NY-001`)

**Example Request:**

```bash
curl http://localhost:3000/vaults/ZH-001/vault_reserve
```

**Response Example:**

```json
{
  "vault_id": "ZH-001",
  "total_bars": 42,
  "total_weight_grams": 45678,
  "total_weight_oz": 1610.6657
}
```

**Note:** The `total_weight_oz` is calculated as `total_weight_grams * 0.035274` (standard ounces, not troy ounces).

## Vault Bars Endpoint

### `GET /vaults/:vault_id/bars`

Returns all bars currently stored in a vault with optional filtering.

**Path Parameters:**
- `vault_id` - The vault identifier (e.g., `ZH-001`, `ZH-002`, `NY-001`)

**Query Parameters:**
- `owner_id` - Filter by current owner
- `owner_status` - Filter by status (e.g., `assigned`, `unassigned`, `awaiting_mint`, `pending_delivery`)
- `purity_min` - Minimum purity filter (e.g., `0.999`)
- `purity_max` - Maximum purity filter (e.g., `0.9999`)
- `limit` - Number of results to return
- `offset` - Number of results to skip (for pagination)

**Example Requests:**

```bash
# Get all bars in vault ZH-001
curl http://localhost:3000/vaults/ZH-001/bars

# Filter by owner
curl http://localhost:3000/vaults/ZH-001/bars?owner_id=refiner_abc

# Filter by owner status
curl http://localhost:3000/vaults/ZH-001/bars?owner_status=unassigned

# Filter by purity range
curl http://localhost:3000/vaults/ZH-001/bars?purity_min=0.9999

# Pagination
curl http://localhost:3000/vaults/ZH-001/bars?limit=2&offset=0

# Combined filters
curl http://localhost:3000/vaults/ZH-001/bars?owner_status=assigned&purity_min=0.999&limit=10
```

**Response Example:**

```json
{
  "vault_id": "ZH-001",
  "total_bars": 3,
  "total_weight_grams": 3000.0,
  "total_oz": 96.4507,
  "bars": [
    {
      "record_id": 1045,
      "serial_number": "LMBA99873",
      "weight_grams": 1000.0,
      "purity": 0.9999,
      "delivery_date": "2025-10-01",
      "owner_id": "refiner_abc",
      "owner_status": "awaiting_mint"
    },
    {
      "record_id": 1046,
      "serial_number": "LMBA99874",
      "weight_grams": 1000.0,
      "purity": 0.9999,
      "delivery_date": "2025-10-01",
      "owner_status": "unassigned"
    },
    {
      "record_id": 1047,
      "serial_number": "LMBA99875",
      "weight_grams": 1000.0,
      "purity": 0.9999,
      "delivery_date": "2025-10-02",
      "owner_id": "client_999",
      "owner_status": "pending_delivery"
    }
  ]
}
```

## Available Mock Vaults

- `ZH-001` - 5 bars
- `ZH-002` - 2 bars
- `NY-001` - 1 bar

## Deployment to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI (optional): `npm i -g vercel`

### Deploy via Vercel Dashboard

1. Push your code to GitHub (already done ✓)
2. Go to https://vercel.com/new
3. Import your GitHub repository: `oh-dev-life/mock-vault-api`
4. Vercel will auto-detect the settings
5. Click **Deploy**

### Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Optional)

If you need to set environment variables in Vercel:
1. Go to your project settings in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `PORT` or any other variables you need

### Vercel Configuration

The project includes:
- **`vercel.json`** - Vercel deployment configuration
- **`.vercelignore`** - Files to exclude from deployment
- **`package.json`** - Updated with `vercel-build` script and Node.js version

### Testing Your Deployment

Once deployed, Vercel will provide a URL like:
```
https://mock-vault-api-xxx.vercel.app
```

Test the endpoints:
```bash
# Test root endpoint
curl https://your-app.vercel.app/

# Test Swagger docs
https://your-app.vercel.app/api-docs

# Test vault bars
curl https://your-app.vercel.app/vaults/ZH-001/bars
```

## Project Structure

```
mock-vault-api/
├── index.js          # Main application file
├── package.json      # Dependencies and scripts
├── vercel.json       # Vercel deployment config
├── .vercelignore     # Vercel ignore rules
├── .env             # Environment variables (local)
├── .gitignore       # Git ignore rules
├── README.md        # This file
├── swagger.js        # Swagger/OpenAPI configuration
├── data/
│   └── mockData.js  # Mock vault and bar data
└── routes/
    └── vaults.js    # Vault API routes
```
