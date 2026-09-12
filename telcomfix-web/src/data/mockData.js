// TelcomFix - Complete Mock Data Layer
// Simulates 25 cell towers across Sri Lanka (Colombo region)

export const TOWERS = [
  { id: 'TOWER_001', name: 'Colombo Central', lat: 6.9271, lng: 79.8612, status: 'OUTAGE', failureRisk: 0.85, impactedSubscribers: 1240, alarms: ['POWER_LOSS', 'FIBER_CUT'], bands: ['4G', '5G'], packetLoss: 100, rssi: -110 },
  { id: 'TOWER_002', name: 'Dehiwala Station', lat: 6.8564, lng: 79.8661, status: 'DEGRADED', failureRisk: 0.62, impactedSubscribers: 430, alarms: ['HIGH_PACKET_LOSS'], bands: ['4G'], packetLoss: 34, rssi: -95 },
  { id: 'TOWER_003', name: 'Nugegoda Hub', lat: 6.8724, lng: 79.8876, status: 'OPERATIONAL', failureRisk: 0.12, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 2, rssi: -72 },
  { id: 'TOWER_004', name: 'Kotte Exchange', lat: 6.8915, lng: 79.9100, status: 'OPERATIONAL', failureRisk: 0.23, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 1, rssi: -68 },
  { id: 'TOWER_005', name: 'Moratuwa South', lat: 6.7745, lng: 79.8821, status: 'OUTAGE', failureRisk: 0.90, impactedSubscribers: 890, alarms: ['GENERATOR_FAULT', 'BATTERY_LOW'], bands: ['4G'], packetLoss: 85, rssi: -108 },
  { id: 'TOWER_006', name: 'Ratmalana Airport', lat: 6.8219, lng: 79.8868, status: 'OPERATIONAL', failureRisk: 0.08, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 0, rssi: -65 },
  { id: 'TOWER_007', name: 'Kelaniya Bridge', lat: 7.0014, lng: 79.9208, status: 'DEGRADED', failureRisk: 0.55, impactedSubscribers: 310, alarms: ['RSSI_DROP'], bands: ['4G'], packetLoss: 22, rssi: -98 },
  { id: 'TOWER_008', name: 'Malabe Tech Park', lat: 6.9041, lng: 79.9708, status: 'OPERATIONAL', failureRisk: 0.18, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 1, rssi: -70 },
  { id: 'TOWER_009', name: 'Kaduwela Junction', lat: 6.9284, lng: 79.9974, status: 'OPERATIONAL', failureRisk: 0.31, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 3, rssi: -75 },
  { id: 'TOWER_010', name: 'Battaramulla East', lat: 6.8937, lng: 79.9285, status: 'DEGRADED', failureRisk: 0.48, impactedSubscribers: 185, alarms: ['INTERFERENCE'], bands: ['4G'], packetLoss: 18, rssi: -92 },
  { id: 'TOWER_011', name: 'Mount Lavinia Beach', lat: 6.8316, lng: 79.8684, status: 'OPERATIONAL', failureRisk: 0.15, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 2, rssi: -71 },
  { id: 'TOWER_012', name: 'Borella Market', lat: 6.9183, lng: 79.8764, status: 'OPERATIONAL', failureRisk: 0.22, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 4, rssi: -74 },
  { id: 'TOWER_013', name: 'Pettah Harbour', lat: 6.9534, lng: 79.8498, status: 'OPERATIONAL', failureRisk: 0.19, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 1, rssi: -67 },
  { id: 'TOWER_014', name: 'Maradana Railway', lat: 6.9338, lng: 79.8647, status: 'OPERATIONAL', failureRisk: 0.27, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 5, rssi: -76 },
  { id: 'TOWER_015', name: 'Wellawatte South', lat: 6.8789, lng: 79.8604, status: 'OPERATIONAL', failureRisk: 0.11, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 2, rssi: -69 },
  { id: 'TOWER_016', name: 'Rajagiriya Hub', lat: 6.9072, lng: 79.8977, status: 'OPERATIONAL', failureRisk: 0.33, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 6, rssi: -78 },
  { id: 'TOWER_017', name: 'Nawala Industrial', lat: 6.8951, lng: 79.9148, status: 'OPERATIONAL', failureRisk: 0.29, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 3, rssi: -73 },
  { id: 'TOWER_018', name: 'Thalawathugoda North', lat: 6.8668, lng: 79.9451, status: 'OPERATIONAL', failureRisk: 0.16, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 2, rssi: -70 },
  { id: 'TOWER_019', name: 'Homagama Center', lat: 6.8450, lng: 79.9919, status: 'OPERATIONAL', failureRisk: 0.14, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 1, rssi: -68 },
  { id: 'TOWER_020', name: 'Piliyandala North', lat: 6.8043, lng: 79.9218, status: 'OPERATIONAL', failureRisk: 0.20, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 3, rssi: -72 },
  { id: 'TOWER_021', name: 'Wattala Highway', lat: 6.9889, lng: 79.8934, status: 'OPERATIONAL', failureRisk: 0.37, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 7, rssi: -80 },
  { id: 'TOWER_022', name: 'Peliyagoda Market', lat: 6.9693, lng: 79.8777, status: 'OPERATIONAL', failureRisk: 0.25, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 4, rssi: -74 },
  { id: 'TOWER_023', name: 'Dematagoda Depot', lat: 6.9405, lng: 79.8789, status: 'OPERATIONAL', failureRisk: 0.21, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 3, rssi: -73 },
  { id: 'TOWER_024', name: 'Nawagamuwa East', lat: 6.9621, lng: 80.0124, status: 'OPERATIONAL', failureRisk: 0.43, impactedSubscribers: 0, alarms: [], bands: ['4G'], packetLoss: 9, rssi: -83 },
  { id: 'TOWER_025', name: 'Hendala Industrial', lat: 7.0138, lng: 79.9015, status: 'OPERATIONAL', failureRisk: 0.38, impactedSubscribers: 0, alarms: [], bands: ['4G', '5G'], packetLoss: 8, rssi: -81 },
];

export const ENGINEERS = [
  { id: 'ENG_001', name: 'Ravi Kumar', zone: 'Western Province - South', status: 'ON_SITE', lat: 6.89, lng: 79.88, currentJobId: 'JOB_001' },
  { id: 'ENG_002', name: 'Suresh Perera', zone: 'Western Province - North', status: 'AVAILABLE', lat: 6.97, lng: 79.90, currentJobId: null },
  { id: 'ENG_003', name: 'Amara Silva', zone: 'Western Province - Central', status: 'IN_TRANSIT', lat: 6.91, lng: 79.92, currentJobId: 'JOB_003' },
  { id: 'ENG_004', name: 'Nimal Fernando', zone: 'Western Province - East', status: 'AVAILABLE', lat: 6.86, lng: 79.97, currentJobId: null },
];

export const CUSTOMERS = [
  { id: 'CUST_001', name: 'Priya Nair', phone: '+94 77 123 4567', towerId: 'TOWER_001', dataBalance: 2.4, dataTotal: 10, fupStatus: 'NORMAL', credits: 225 },
  { id: 'CUST_002', name: 'Ashan Perera', phone: '+94 76 987 6543', towerId: 'TOWER_003', dataBalance: 7.8, dataTotal: 15, fupStatus: 'NORMAL', credits: 0 },
];

export const TICKETS = [
  {
    id: 'TKT-0042', customerId: 'CUST_001', towerIds: ['TOWER_001'],
    category: 'No Signal / Tower Down', description: 'No signal since morning.',
    status: 'TECHNICIAN_ASSIGNED', stage: 3,
    checks: { coverage: 'OUTAGE_CONFIRMED', signal: 'OUTAGE_CONFIRMED', usage: 'OK', billing: 'OK', device: 'OK' },
    resolution: 'Outage confirmed on TOWER_001 (POWER_LOSS + FIBER_CUT). Field engineer Ravi Kumar dispatched. ETA: 2 hours.',
    engineerId: 'ENG_001', createdAt: '2026-09-12T07:30:00Z', resolvedAt: null,
  },
  {
    id: 'TKT-0041', customerId: 'CUST_001', towerIds: ['TOWER_001'],
    category: 'Unexpected Balance Drain', description: 'Lost 5GB data overnight.',
    status: 'RESOLVED', stage: 4,
    checks: { coverage: 'OK', signal: 'OK', usage: 'ANOMALY_DETECTED', billing: 'VAS_FOUND', device: 'OK' },
    resolution: 'Unwanted VAS "StreamPack HD" subscription removed. LKR 150 goodwill credit applied automatically.',
    engineerId: null, createdAt: '2026-09-11T14:00:00Z', resolvedAt: '2026-09-11T14:05:00Z',
  },
  {
    id: 'TKT-0039', customerId: 'CUST_002', towerIds: ['TOWER_002'],
    category: 'Slow / No Internet', description: 'Very slow speeds during peak hours.',
    status: 'AI_DIAGNOSTIC_RUNNING', stage: 2,
    checks: { coverage: 'DEGRADED', signal: 'RSSI_DROP', usage: 'PENDING', billing: 'PENDING', device: 'PENDING' },
    resolution: null, engineerId: 'ENG_003', createdAt: '2026-09-12T09:00:00Z', resolvedAt: null,
  },
];

export const JOBS = [
  {
    id: 'JOB_001', ticketId: 'TKT-0042', towerId: 'TOWER_001', towerName: 'Colombo Central',
    lat: 6.9271, lng: 79.8612, severity: 'Critical Outage',
    alarmCode: 'POWER_LOSS', alarmCode2: 'FIBER_CUT', impactedSubscribers: 1240,
    status: 'IN_PROGRESS', assignedTo: 'ENG_001',
    bands: ['4G', '5G'], batteryType: 'Li-Ion 48V', radioUnits: 'Ericsson AIR 6449',
    dispatched: '2026-09-12T09:00:00Z',
  },
  {
    id: 'JOB_002', ticketId: 'TKT-0045', towerId: 'TOWER_005', towerName: 'Moratuwa South',
    lat: 6.7745, lng: 79.8821, severity: 'Critical Outage',
    alarmCode: 'GENERATOR_FAULT', alarmCode2: 'BATTERY_LOW', impactedSubscribers: 890,
    status: 'PENDING', assignedTo: null,
    bands: ['4G'], batteryType: 'Lead Acid 24V', radioUnits: 'Nokia AirScale 64T64R',
    dispatched: null,
  },
  {
    id: 'JOB_003', ticketId: 'TKT-0039', towerId: 'TOWER_002', towerName: 'Dehiwala Station',
    lat: 6.8564, lng: 79.8661, severity: 'Degraded Hardware',
    alarmCode: 'HIGH_PACKET_LOSS', alarmCode2: null, impactedSubscribers: 430,
    status: 'IN_PROGRESS', assignedTo: 'ENG_003',
    bands: ['4G'], batteryType: 'Li-Ion 24V', radioUnits: 'Huawei AAU5614',
    dispatched: '2026-09-12T08:00:00Z',
  },
];

export const ALARM_EVENTS_INITIAL = [
  { id: 'AL_001', towerId: 'TOWER_001', towerName: 'Colombo Central', type: 'POWER_LOSS', severity: 'critical', time: '09:12', packetLoss: '100%', rssi: '-110 dBm' },
  { id: 'AL_002', towerId: 'TOWER_001', towerName: 'Colombo Central', type: 'FIBER_CUT', severity: 'critical', time: '09:14', packetLoss: '100%', rssi: '-110 dBm' },
  { id: 'AL_003', towerId: 'TOWER_002', towerName: 'Dehiwala Station', type: 'HIGH_PACKET_LOSS', severity: 'warning', time: '09:31', packetLoss: '34%', rssi: '-95 dBm' },
  { id: 'AL_004', towerId: 'TOWER_005', towerName: 'Moratuwa South', type: 'GENERATOR_FAULT', severity: 'critical', time: '09:45', packetLoss: '85%', rssi: '-108 dBm' },
  { id: 'AL_005', towerId: 'TOWER_005', towerName: 'Moratuwa South', type: 'BATTERY_LOW', severity: 'warning', time: '09:47', packetLoss: '85%', rssi: '-108 dBm' },
  { id: 'AL_006', towerId: 'TOWER_007', towerName: 'Kelaniya Bridge', type: 'RSSI_DROP', severity: 'warning', time: '09:52', packetLoss: '22%', rssi: '-98 dBm' },
  { id: 'AL_007', towerId: 'TOWER_010', towerName: 'Battaramulla East', type: 'INTERFERENCE', severity: 'warning', time: '10:01', packetLoss: '18%', rssi: '-92 dBm' },
];

export const AUDIT_LOGS = [
  { id: 'LOG_001', timestamp: '2026-09-12T09:14:00Z', ticketId: 'TKT-0042', customerId: 'CUST_001', action: 'OUTAGE_BROADCAST', checks: 'coverage:OUTAGE, signal:OUTAGE', aiConfidence: 0.97, result: 'Broadcast sent to 1240 subscribers' },
  { id: 'LOG_002', timestamp: '2026-09-11T14:05:00Z', ticketId: 'TKT-0041', customerId: 'CUST_001', action: 'AUTO_REFUND_LKR150', checks: 'usage:ANOMALY, billing:VAS_FOUND', aiConfidence: 0.93, result: 'VAS removed, credit issued' },
  { id: 'LOG_003', timestamp: '2026-09-10T16:30:00Z', ticketId: 'TKT-0035', customerId: 'CUST_003', action: 'APN_RESET_OTA', checks: 'device:APN_MISCONFIGURED', aiConfidence: 0.88, result: 'APN settings pushed, resolved' },
  { id: 'LOG_004', timestamp: '2026-09-10T11:00:00Z', ticketId: 'TKT-0033', customerId: 'CUST_004', action: 'FIELD_DISPATCH', checks: 'coverage:OUTAGE', aiConfidence: 0.91, result: 'ENG_002 dispatched, 4h MTTR' },
  { id: 'LOG_005', timestamp: '2026-09-09T08:15:00Z', ticketId: 'TKT-0028', customerId: 'CUST_005', action: 'AUTO_REFUND_LKR75', checks: 'billing:OVERAGE_CALC_ERROR', aiConfidence: 0.89, result: 'Credit issued automatically' },
  { id: 'LOG_006', timestamp: '2026-09-08T14:22:00Z', ticketId: 'TKT-0024', customerId: 'CUST_006', action: 'OUTAGE_BROADCAST', checks: 'coverage:OUTAGE, signal:OUTAGE', aiConfidence: 0.95, result: 'Broadcast sent, ETA 3h' },
];

export const USERS = [
  { id: 'USR_001', name: 'Admin User', email: 'admin@telcomfix.lk', role: 'System Admin', zone: 'All', status: 'ACTIVE', lastLogin: '2026-09-12T08:00:00Z' },
  { id: 'USR_002', name: 'Noc Operator 1', email: 'noc1@telcomfix.lk', role: 'NOC Engineer', zone: 'Western Province', status: 'ACTIVE', lastLogin: '2026-09-12T09:00:00Z' },
  { id: 'USR_003', name: 'Ravi Kumar', email: 'ravi@telcomfix.lk', role: 'Field Engineer', zone: 'Western Province - South', status: 'ACTIVE', lastLogin: '2026-09-12T07:30:00Z' },
  { id: 'USR_004', name: 'Suresh Perera', email: 'suresh@telcomfix.lk', role: 'Field Engineer', zone: 'Western Province - North', status: 'ACTIVE', lastLogin: '2026-09-11T16:00:00Z' },
  { id: 'USR_005', name: 'Amara Silva', email: 'amara@telcomfix.lk', role: 'Field Engineer', zone: 'Western Province - Central', status: 'ACTIVE', lastLogin: '2026-09-12T08:15:00Z' },
  { id: 'USR_006', name: 'Nimal Fernando', email: 'nimal@telcomfix.lk', role: 'Field Engineer', zone: 'Western Province - East', status: 'INACTIVE', lastLogin: '2026-09-10T14:00:00Z' },
];

export const AI_CONFIG_DEFAULTS = {
  autoRefundConfidence: 0.85,
  apnResetConfidence: 0.80,
  outageBoradcastConfidence: 0.90,
  fieldDispatchConfidence: 0.88,
  predictiveAlertRiskThreshold: 0.65,
  maxAutoRefundPerCycle: 500,
  enableAutoRefund: true,
  enableOutageBroadcast: true,
  enableApnReset: true,
  enablePredictiveAlerts: true,
};

export const MTTR_DATA = [
  { month: 'Apr', mttr: 5.2, deflection: 62 },
  { month: 'May', mttr: 4.8, deflection: 67 },
  { month: 'Jun', mttr: 4.5, deflection: 71 },
  { month: 'Jul', mttr: 3.9, deflection: 75 },
  { month: 'Aug', mttr: 3.4, deflection: 80 },
  { month: 'Sep', mttr: 2.8, deflection: 84 },
];
