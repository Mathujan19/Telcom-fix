import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const COLORS = ['#16a34a', '#dc2626', '#2563eb', '#f59e0b'];

export default function Analytics() {
  const { state } = useApp();
  const { mttrData, towers } = state;

  const resolutionData = [
    { name: 'Auto-Resolved', value: 68, color: '#16a34a' },
    { name: 'Field Dispatch', value: 18, color: '#2563eb' },
    { name: 'Manual Review', value: 9, color: '#f59e0b' },
    { name: 'Unresolved', value: 5, color: '#dc2626' },
  ];

  const checkAccuracy = [
    { check: 'Coverage', accuracy: 97, count: 280 },
    { check: 'Signal', accuracy: 94, count: 265 },
    { check: 'Usage', accuracy: 91, count: 245 },
    { check: 'Billing', accuracy: 96, count: 290 },
    { check: 'Device', accuracy: 88, count: 210 },
  ];

  const weeklyTickets = [
    { day: 'Mon', tickets: 42, autoResolved: 31 },
    { day: 'Tue', tickets: 38, autoResolved: 29 },
    { day: 'Wed', tickets: 55, autoResolved: 38 },
    { day: 'Thu', tickets: 48, autoResolved: 35 },
    { day: 'Fri', tickets: 61, autoResolved: 44 },
    { day: 'Sat', tickets: 30, autoResolved: 24 },
    { day: 'Sun', tickets: 25, autoResolved: 20 },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* KPI Stats */}
      <div className="stats-grid" style={{ padding: 0, marginBottom: 20 }}>
        {[
          { label: 'Avg MTTR (Sep)', value: '2.8h', sub: '↓ 1.7h from Aug', color: 'green', icon: '⏱️' },
          { label: 'Call Deflection Rate', value: '84%', sub: '↑ 4% from Aug', color: 'blue', icon: '📞' },
          { label: 'Auto-Resolution Rate', value: '68%', sub: '190 of 280 tickets', color: 'red', icon: '🤖' },
          { label: 'Customer Satisfaction', value: '4.3/5', sub: 'Based on 142 ratings', color: 'yellow', icon: '⭐' },
        ].map(stat => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ fontSize: stat.value.length > 4 ? 22 : 28 }}>{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* MTTR Trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⏱️ Mean Time to Repair (MTTR) Trend</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mttrData}>
                <defs>
                  <linearGradient id="mttrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="h" />
                <Tooltip formatter={(val) => [val + 'h', 'MTTR']} />
                <Area type="monotone" dataKey="mttr" stroke="#dc2626" strokeWidth={2} fill="url(#mttrGrad)" dot={{ fill: '#dc2626', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Call Deflection */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📞 Call Deflection Rate</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mttrData}>
                <defs>
                  <linearGradient id="deflGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" domain={[50, 100]} />
                <Tooltip formatter={(val) => [val + '%', 'Deflection']} />
                <Area type="monotone" dataKey="deflection" stroke="#16a34a" strokeWidth={2} fill="url(#deflGrad)" dot={{ fill: '#16a34a', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Weekly Tickets */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div className="card-title">📅 Weekly Ticket Volume</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyTickets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="tickets" name="Total Tickets" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="autoResolved" name="Auto-Resolved" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🤖 Resolution Breakdown</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={resolutionData} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false} fontSize={11}>
                  {resolutionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {resolutionData.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  <span style={{ color: 'var(--gray-600)' }}>{item.name}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
