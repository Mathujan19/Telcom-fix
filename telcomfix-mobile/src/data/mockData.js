// Complete mock data for TelcomFix
export const TOWERS = [
  { id: 'TOWER_001', name: 'Colombo Central', lat: 6.9271, lng: 79.8612, status: 'OUTAGE', failureRisk: 0.85, impactedSubscribers: 1240, alarms: ['POWER_LOSS', 'FIBER_CUT'], bands: ['4G', '5G'] },
  { id: 'TOWER_002', name: 'Dehiwala Station', lat: 6.8564, lng: 79.8661, status: 'DEGRADED', failureRisk: 0.62, impactedSubscribers: 430, alarms: ['HIGH_PACKET_LOSS'], bands: ['4G'] },
  { id: 'TOWER_003', name: 'Nugegoda Hub', lat: 6.8724, lng: 79.8876, status: 'OPERATIONAL', failureRisk: 0.12, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'] },
  { id: 'TOWER_004', name: 'Kotte Exchange', lat: 6.8915, lng: 79.9100, status: 'OPERATIONAL', failureRisk: 0.23, impactedSubscribers: 0, alarms: [], bands: ['4G'] },
  { id: 'TOWER_005', name: 'Moratuwa South', lat: 6.7745, lng: 79.8821, status: 'OUTAGE', failureRisk: 0.90, impactedSubscribers: 890, alarms: ['GENERATOR_FAULT', 'BATTERY_LOW'], bands: ['4G'] },
];

export const CUSTOMERS = [
  { id: 'CUST_001', name: 'Priya Nair', phone: '+94 77 123 4567', towerId: 'TOWER_001', dataBalance: 2.4, dataTotal: 10, fupStatus: 'NORMAL', credits: 150 },
  { id: 'CUST_002', name: 'Ashan Perera', phone: '+94 76 987 6543', towerId: 'TOWER_003', dataBalance: 7.8, dataTotal: 15, fupStatus: 'NORMAL', credits: 0 },
];

export const TICKETS = [
  {
    id: 'TKT-0042',
    customerId: 'CUST_001',
    towerIds: ['TOWER_001'],
    category: 'No Signal / Tower Down',
    description: 'No signal since this morning, cannot make calls or use data.',
    status: 'AUTO_RESOLVED',
    stage: 3,
    checks: { coverage: 'OUTAGE_CONFIRMED', signal: 'OK', usage: 'OK', billing: 'OK', device: 'OK' },
    resolution: 'Outage confirmed on TOWER_001. Field team dispatched. ETA: 2 hours.',
    engineerId: 'ENG_001',
    createdAt: '2026-09-12T07:30:00Z',
    resolvedAt: null,
  },
  {
    id: 'TKT-0041',
    customerId: 'CUST_001',
    towerIds: ['TOWER_001'],
    category: 'Unexpected Balance Drain',
    description: 'Lost 5GB data overnight without using it.',
    status: 'RESOLVED',
    stage: 4,
    checks: { coverage: 'OK', signal: 'OK', usage: 'ANOMALY_DETECTED', billing: 'VAS_FOUND', device: 'OK' },
    resolution: 'Unwanted VAS "StreamPack" subscription removed. LKR 150 goodwill credit applied.',
    engineerId: null,
    createdAt: '2026-09-11T14:00:00Z',
    resolvedAt: '2026-09-11T14:05:00Z',
  },
];

export const VAS_ITEMS = [
  { id: 'VAS_001', name: 'StreamPack HD', cost: '250/month', status: 'ACTIVE' },
  { id: 'VAS_002', name: 'Cloud Backup 50GB', cost: '199/month', status: 'ACTIVE' },
  { id: 'VAS_003', name: 'TuneZone Music', cost: '149/month', status: 'INACTIVE' },
];

export const CREDIT_HISTORY = [
  { id: 'CR_001', amount: 150, reason: 'Goodwill refund - VAS removal', date: '2026-09-11' },
  { id: 'CR_002', amount: 75, reason: 'Compensation - Network outage 4h', date: '2026-09-08' },
];

export const JOBS = [
  {
    id: 'JOB_001',
    ticketId: 'TKT-0042',
    towerId: 'TOWER_001',
    towerName: 'Colombo Central',
    lat: 6.9271,
    lng: 79.8612,
    severity: 'Critical Outage',
    alarmCode: 'POWER_LOSS',
    alarmCode2: 'FIBER_CUT',
    impactedSubscribers: 1240,
    status: 'IN_PROGRESS',
    assignedTo: 'ENG_001',
    bands: ['4G', '5G'],
    batteryType: 'Li-Ion 48V',
    radioUnits: 'Ericsson AIR 6449',
    dispatched: '2026-09-12T09:00:00Z',
  },
  {
    id: 'JOB_002',
    ticketId: 'TKT-0045',
    towerId: 'TOWER_005',
    towerName: 'Moratuwa South',
    lat: 6.7745,
    lng: 79.8821,
    severity: 'Critical Outage',
    alarmCode: 'GENERATOR_FAULT',
    alarmCode2: 'BATTERY_LOW',
    impactedSubscribers: 890,
    status: 'PENDING',
    assignedTo: 'ENG_001',
    bands: ['4G'],
    batteryType: 'Lead Acid 24V',
    radioUnits: 'Nokia AirScale 64T64R',
    dispatched: '2026-09-12T10:00:00Z',
  },
  {
    id: 'JOB_003',
    ticketId: 'TKT-0039',
    towerId: 'TOWER_002',
    towerName: 'Dehiwala Station',
    lat: 6.8564,
    lng: 79.8661,
    severity: 'Degraded Hardware',
    alarmCode: 'HIGH_PACKET_LOSS',
    alarmCode2: null,
    impactedSubscribers: 430,
    status: 'PENDING',
    assignedTo: 'ENG_001',
    bands: ['4G'],
    batteryType: 'Li-Ion 24V',
    radioUnits: 'Huawei AAU5614',
    dispatched: '2026-09-12T08:00:00Z',
  },
];

export const ALARM_EVENTS = [
  { id: 'AL_001', towerId: 'TOWER_001', type: 'POWER_LOSS', severity: 'critical', time: '09:12', packetLoss: '100%' },
  { id: 'AL_002', towerId: 'TOWER_001', type: 'FIBER_CUT', severity: 'critical', time: '09:14', packetLoss: '100%' },
  { id: 'AL_003', towerId: 'TOWER_002', type: 'HIGH_PACKET_LOSS', severity: 'warning', time: '09:31', packetLoss: '34%' },
  { id: 'AL_004', towerId: 'TOWER_005', type: 'GENERATOR_FAULT', severity: 'critical', time: '09:45', packetLoss: '85%' },
  { id: 'AL_005', towerId: 'TOWER_005', type: 'BATTERY_LOW', severity: 'warning', time: '09:47', packetLoss: '85%' },
];
