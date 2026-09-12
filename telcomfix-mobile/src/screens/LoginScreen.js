import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { actions, state } = useApp();
  const [loading, setLoading] = useState(null); // 'customer' | 'engineer'

  const handleLogin = async (role) => {
    setLoading(role);
    try {
      await actions.demoLogin(role);
    } catch (err) {
      console.warn('Login error (using local fallback):', err?.message);
    } finally {
      setLoading(null);
    }
  };

  const ROLES = [
    {
      id: 'customer',
      icon: '👤',
      name: 'Customer',
      desc: 'Report issues, track tickets, check billing',
      email: 'customer@telcomfix.lk',
      badgeColor: '#2563eb',
    },
    {
      id: 'engineer',
      icon: '🔧',
      name: 'Field Engineer',
      desc: 'View dispatched jobs, close tickets on-site',
      email: 'engineer@telcomfix.lk',
      badgeColor: '#dc2626',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>📡</Text>
        </View>
        <Text style={styles.title}>TelcomFix</Text>
        <Text style={styles.subtitle}>Detecting & Fixing Mobile Service Problems at Scale</Text>

        {/* Firebase indicator */}
        <View style={styles.firebaseBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.firebaseText}>Firebase Connected</Text>
        </View>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Select your role to continue</Text>

        {ROLES.map(role => (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleCard, loading === role.id && styles.selectedCard]}
            onPress={() => handleLogin(role.id)}
            disabled={loading !== null}
            activeOpacity={0.8}
          >
            <Text style={styles.roleIcon}>{role.icon}</Text>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>{role.name}</Text>
              <Text style={styles.roleDesc}>{role.desc}</Text>
              <Text style={styles.roleEmail}>🔑 {role.email}</Text>
            </View>
            {loading === role.id ? (
              <ActivityIndicator color="#dc2626" size="small" />
            ) : (
              <View style={[styles.badge, { backgroundColor: role.badgeColor }]}>
                <Text style={styles.badgeText}>DEMO</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🌐 Web Portals (NOC & Admin){'\n'}
            <Text style={styles.infoCode}>npm run dev</Text> in <Text style={styles.infoCode}>telcomfix-web/</Text>
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>CodeArena'26 · TelcomFix · Powered by Firebase 🔥</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 48 : 60,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoBox: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: '#dc2626',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#dc2626', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  logoText: { fontSize: 36 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
  firebaseBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f0fdf4', borderRadius: 20, borderWidth: 1, borderColor: '#bbf7d0',
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 12,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  firebaseText: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
  roleContainer: { flex: 1, padding: 24 },
  roleLabel: {
    fontSize: 12, fontWeight: '700', color: '#9ca3af',
    marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  roleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 14,
    borderWidth: 2, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  selectedCard: { borderColor: '#dc2626', backgroundColor: '#fff5f5' },
  roleIcon: { fontSize: 32, marginRight: 14 },
  roleInfo: { flex: 1 },
  roleName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  roleDesc: { fontSize: 12, color: '#6b7280', marginTop: 3 },
  roleEmail: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  infoBox: {
    marginTop: 16, padding: 14, backgroundColor: '#f1f5f9',
    borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
  },
  infoText: { fontSize: 12, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  infoCode: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#374151' },
  footer: { textAlign: 'center', color: '#9ca3af', fontSize: 11, paddingBottom: 20 },
});
