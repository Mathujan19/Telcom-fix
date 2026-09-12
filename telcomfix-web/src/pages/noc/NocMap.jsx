import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';

const STATUS_CONFIG = {
  OPERATIONAL: { color: '#16a34a', fillColor: '#22c55e', radius: 12 },
  DEGRADED: { color: '#d97706', fillColor: '#f59e0b', radius: 14 },
  OUTAGE: { color: '#b91c1c', fillColor: '#ef4444', radius: 18 },
};

function TowerMarker({ tower, onSelect }) {
  const cfg = STATUS_CONFIG[tower.status] || STATUS_CONFIG.OPERATIONAL;

  return (
    <CircleMarker
      center={[tower.lat, tower.lng]}
      radius={cfg.radius}
      pathOptions={{
        color: cfg.color,
        fillColor: cfg.fillColor,
        fillOpacity: 0.85,
        weight: 2,
      }}
      eventHandlers={{ click: () => onSelect(tower) }}
    >
      <Popup>
        <div className="tower-popup" style={{ minWidth: 200 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>📡 {tower.name}</h3>
          <div className={`status ${tower.status}`}>{tower.status}</div>
          <p>ID: {tower.id}</p>
          <p>Bands: {tower.bands.join(' / ')}</p>
          <p>Impacted: <strong>{tower.impactedSubscribers}</strong> subscribers</p>
          <p>Packet Loss: <strong>{tower.packetLoss}%</strong></p>
          <p>RSSI: <strong>{tower.rssi} dBm</strong></p>
          {tower.alarms.length > 0 && (
            <p>🚨 Alarms: {tower.alarms.join(', ')}</p>
          )}
          <p>Failure Risk: <strong style={{ color: tower.failureRisk > 0.6 ? '#dc2626' : tower.failureRisk > 0.3 ? '#d97706' : '#16a34a' }}>
            {Math.round(tower.failureRisk * 100)}%
          </strong></p>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default function NocMap() {
  const { state } = useApp();
  const { towers, alarmEvents, mapLayer } = state;
  const [selectedTower, setSelectedTower] = useState(null);
  const [layer, setLayer] = useState('status');

  const totalImpacted = towers.reduce((sum, t) => sum + t.impactedSubscribers, 0);
  const outages = towers.filter(t => t.status === 'OUTAGE');

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
      {/* Map */}
      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {towers.map(tower => (
          <TowerMarker key={tower.id} tower={tower} onSelect={setSelectedTower} />
        ))}
      </MapContainer>

      {/* Stats Bar */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 999,
        display: 'flex', gap: 12, pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto', background: 'white', borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔴</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#dc2626' }}>{outages.length}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>OUTAGES</div>
          </div>
        </div>
        <div style={{ pointerEvents: 'auto', background: 'white', borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🟡</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#d97706' }}>{towers.filter(t => t.status === 'DEGRADED').length}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>DEGRADED</div>
          </div>
        </div>
        <div style={{ pointerEvents: 'auto', background: 'white', borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>👥</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{totalImpacted.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>IMPACTED</div>
          </div>
        </div>
        <div style={{ pointerEvents: 'auto', background: 'white', borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#7c3aed' }}>{alarmEvents.filter(a => a.severity === 'critical').length}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>CRITICAL</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="map-legend" style={{ bottom: 32 }}>
        <div className="legend-title">Tower Status</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#22c55e' }} /> Operational</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#f59e0b' }} /> Degraded</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#ef4444' }} /> Outage</div>
        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 8 }}>
          <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>Size = Severity</div>
          <div style={{ fontSize: 10, color: '#6b7280' }}>Click tower for details</div>
        </div>
      </div>

      {/* Recent Alarms Ticker */}
      <div style={{
        position: 'absolute', bottom: 32, left: 200, right: 16, zIndex: 999,
        background: 'white', borderRadius: 12, padding: '10px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, overflow: 'hidden' }}>
          <span style={{ fontWeight: 700, color: '#dc2626', flexShrink: 0 }}>🚨 LIVE</span>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
            {alarmEvents.slice(0, 3).map((alarm, i) => (
              <span key={alarm.id} style={{ marginRight: 24, color: alarm.severity === 'critical' ? '#dc2626' : '#d97706' }}>
                {alarm.towerName} → {alarm.type} [{alarm.time}]
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tower Detail Panel */}
      {selectedTower && (
        <div style={{
          position: 'absolute', top: 80, right: 16, zIndex: 999,
          width: 300, background: 'white', borderRadius: 16,
          boxShadow: '0 10px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}>
          <div style={{ background: selectedTower.status === 'OUTAGE' ? '#dc2626' : selectedTower.status === 'DEGRADED' ? '#d97706' : '#16a34a', padding: '16px 20px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>📡 {selectedTower.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{selectedTower.id}</div>
              </div>
              <button onClick={() => setSelectedTower(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>{selectedTower.status}</div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Packet Loss', value: selectedTower.packetLoss + '%' },
                { label: 'RSSI', value: selectedTower.rssi + ' dBm' },
                { label: 'Impacted', value: selectedTower.impactedSubscribers },
                { label: 'Risk Score', value: Math.round(selectedTower.failureRisk * 100) + '%' },
              ].map(item => (
                <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
            {selectedTower.alarms.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase' }}>Active Alarms</div>
                {selectedTower.alarms.map(alarm => (
                  <span key={alarm} style={{ display: 'inline-block', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, marginRight: 4, marginBottom: 4 }}>
                    ⚠️ {alarm}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
