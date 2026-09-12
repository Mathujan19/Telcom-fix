import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserCheck, HardHat, UserX, Search, Plus, CheckCircle2, UserPlus } from 'lucide-react';

const ROLES = ['System Admin', 'NOC Engineer', 'Field Engineer', 'Customer Support'];
const ZONES = ['All', 'Western Province', 'Western Province - South', 'Western Province - North', 'Western Province - Central', 'Western Province - East'];

export default function UserManagement() {
  const { state, dispatch } = useApp();
  const { users } = state;
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Field Engineer', zone: 'Western Province' });
  const [added, setAdded] = useState(false);

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    dispatch({
      type: 'ADD_USER',
      user: {
        id: 'USR_' + Date.now(),
        ...newUser,
        status: 'ACTIVE',
        lastLogin: null,
      },
    });
    setNewUser({ name: '', email: '', role: 'Field Engineer', zone: 'Western Province' });
    setShowAddModal(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const toggleStatus = (userId, currentStatus) => {
    dispatch({ type: 'UPDATE_USER', id: userId, updates: { status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
  };

  const getRoleBadge = (role) => {
    const map = {
      'System Admin': 'badge-purple',
      'NOC Engineer': 'badge-blue',
      'Field Engineer': 'badge-yellow',
      'Customer Support': 'badge-gray',
    };
    return <span className={`badge ${map[role] || 'badge-gray'}`}>{role}</span>;
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="stats-grid" style={{ padding: 0, marginBottom: 20 }}>
        {[
          { label: 'Total Users', value: users.length, color: 'blue', icon: <Users size={24} /> },
          { label: 'Active', value: users.filter(u => u.status === 'ACTIVE').length, color: 'green', icon: <UserCheck size={24} /> },
          { label: 'Field Engineers', value: users.filter(u => u.role === 'Field Engineer').length, color: 'yellow', icon: <HardHat size={24} /> },
          { label: 'Inactive', value: users.filter(u => u.status === 'INACTIVE').length, color: 'red', icon: <UserX size={24} /> },
        ].map(stat => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><Users size={18} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 8}} /> User Management Console</div>
            <div className="card-subtitle">Provision credentials, assign zones, manage roles</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex' }}><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 220, height: 36 }}
              />
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 4}} /> Add User
            </button>
          </div>
        </div>

        {added && (
          <div style={{ margin: '0 20px', padding: 10, background: 'var(--green-light)', border: '1px solid #bbf7d0', borderRadius: 10, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
            <CheckCircle2 size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 6}} /> User added successfully!
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--red-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td style={{ fontSize: 12 }}>{user.zone}</td>
                  <td>
                    <span className={`badge ${user.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => toggleStatus(user.id, user.status)}
                      >
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: 440, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}><UserPlus size={20} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 8}} /> Add New User</h2>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. John Silva" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@telcomfix.lk" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Territory Zone</label>
              <select className="form-select" value={newUser.zone} onChange={e => setNewUser({ ...newUser, zone: e.target.value })}>
                {ZONES.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={handleAddUser} style={{ flex: 1, justifyContent: 'center' }}>
                <CheckCircle2 size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 6}} /> Create User
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
