#!/bin/bash

# Test script for Mock Vault API
BASE_URL="http://localhost:3000"

echo "=== Mock Vault API Test Suite ==="
echo ""

echo "1. Testing root endpoint..."
curl -s "$BASE_URL/" | jq '.'
echo ""

echo "2. Testing health check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""

echo "3. List all vaults..."
curl -s "$BASE_URL/vaults" | jq '.'
echo ""

echo "4. Get all bars in vault ZH-001..."
curl -s "$BASE_URL/vaults/ZH-001/bars" | jq '.'
echo ""

echo "5. Filter by owner_id=refiner_abc..."
curl -s "$BASE_URL/vaults/ZH-001/bars?owner_id=refiner_abc" | jq '.'
echo ""

echo "6. Filter by owner_status=unassigned..."
curl -s "$BASE_URL/vaults/ZH-001/bars?owner_status=unassigned" | jq '.'
echo ""

echo "7. Filter by purity_min=0.9999..."
curl -s "$BASE_URL/vaults/ZH-001/bars?purity_min=0.9999" | jq '.'
echo ""

echo "8. Pagination test (limit=2, offset=0)..."
curl -s "$BASE_URL/vaults/ZH-001/bars?limit=2&offset=0" | jq '.'
echo ""

echo "9. Combined filters (owner_status=assigned & purity_min=0.999)..."
curl -s "$BASE_URL/vaults/ZH-001/bars?owner_status=assigned&purity_min=0.999" | jq '.'
echo ""

echo "10. Test non-existent vault..."
curl -s "$BASE_URL/vaults/INVALID/bars" | jq '.'
echo ""

echo "=== Tests Complete ==="
