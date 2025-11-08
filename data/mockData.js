// Mock data for vault bars
const vaults = {
  'ZH-001': [
    {
      record_id: 1045,
      serial_number: 'LMBA99873',
      weight_grams: 1000.0,
      purity: 0.9999,
      delivery_date: '2025-10-01',
      owner_id: 'refiner_abc',
      owner_status: 'awaiting_mint'
    },
    {
      record_id: 1046,
      serial_number: 'LMBA99874',
      weight_grams: 1000.0,
      purity: 0.9999,
      delivery_date: '2025-10-01',
      owner_status: 'unassigned'
    },
    {
      record_id: 1047,
      serial_number: 'LMBA99875',
      weight_grams: 1000.0,
      purity: 0.9999,
      delivery_date: '2025-10-02',
      owner_id: 'client_999',
      owner_status: 'pending_delivery'
    },
    {
      record_id: 1048,
      serial_number: 'LMBA99876',
      weight_grams: 500.0,
      purity: 0.999,
      delivery_date: '2025-10-03',
      owner_id: 'refiner_abc',
      owner_status: 'assigned'
    },
    {
      record_id: 1049,
      serial_number: 'LMBA99877',
      weight_grams: 1000.0,
      purity: 0.9995,
      delivery_date: '2025-10-04',
      owner_id: 'client_888',
      owner_status: 'assigned'
    }
  ],
  'ZH-002': [
    {
      record_id: 2001,
      serial_number: 'LMBA88001',
      weight_grams: 1000.0,
      purity: 0.9999,
      delivery_date: '2025-09-15',
      owner_id: 'client_777',
      owner_status: 'assigned'
    },
    {
      record_id: 2002,
      serial_number: 'LMBA88002',
      weight_grams: 1000.0,
      purity: 0.999,
      delivery_date: '2025-09-16',
      owner_status: 'unassigned'
    }
  ],
  'NY-001': [
    {
      record_id: 3001,
      serial_number: 'LMBA77001',
      weight_grams: 1000.0,
      purity: 0.9999,
      delivery_date: '2025-08-20',
      owner_id: 'refiner_xyz',
      owner_status: 'awaiting_mint'
    }
  ]
};

module.exports = { vaults };
