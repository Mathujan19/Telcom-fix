import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export default function BillingScreen() {
  const { state, dispatch } = useApp();
  const { currentUser, vasItems, creditHistory } = state;

  const dataPercent = currentUser
    ? (currentUser.dataBalance / currentUser.dataTotal) * 100
    : 0;

  const barColor = dataPercent < 20
    ? '#ef4444'
    : dataPercent < 50
      ? '#f59e0b'
      : '#16a34a';

  const handleUnsubscribe = (vasId, vasName) => {
    Alert.alert(
      'Unsubscribe',
      `Remove "${vasName}" from your account? This will stop future charges.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unsubscribe',
          style: 'destructive',
          onPress: () => dispatch({ type: 'UNSUBSCRIBE_VAS', id: vasId }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Billing & Wallet</Text>
          <Text style={styles.subtitle}>Manage your data, add-ons, and credits</Text>
        </View>

        {/* Data Balance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Data Balance</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataUsed}>{currentUser?.dataBalance}GB</Text>
            <Text style={styles.dataTotal}> of {currentUser?.dataTotal}GB remaining</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${dataPercent}%`, backgroundColor: barColor }]} />
          </View>
          <Text style={styles.fupStatus}>
            FUP Status: <Text style={{ fontWeight: '600', color: '#374151' }}>{currentUser?.fupStatus}</Text>
            {'  ·  Policy resets 30 Sep 2026'}
          </Text>
        </View>

        {/* Credit Wallet */}
        <View style={styles.card}>
          <View style={styles.creditHeader}>
            <Text style={styles.cardTitle}>💰 Credit Wallet</Text>
            <Text style={styles.creditBalance}>LKR {currentUser?.credits}</Text>
          </View>

          {creditHistory.map((cr, i) => (
            <View key={cr.id} style={[styles.creditItem, i === 0 && { borderTopWidth: 0 }]}>
              <View style={styles.creditLeft}>
                <Text style={styles.creditAmount}>+LKR {cr.amount}</Text>
                <Text style={styles.creditReason}>{cr.reason}</Text>
              </View>
              <Text style={styles.creditDate}>{cr.date}</Text>
            </View>
          ))}
        </View>

        {/* VAS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📦 Value-Added Services</Text>
          <Text style={styles.vasNote}>
            Unknown charges? Review and remove add-ons you didn't sign up for.
          </Text>
          {vasItems.map((vas, i) => (
            <View key={vas.id} style={[styles.vasItem, i === 0 && { borderTopWidth: 0 }]}>
              <View style={styles.vasLeft}>
                <View style={styles.vasNameRow}>
                  <Text style={styles.vasName}>{vas.name}</Text>
                  {vas.status === 'ACTIVE' && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>ACTIVE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.vasCost}>LKR {vas.cost}</Text>
              </View>
              {vas.status === 'ACTIVE' ? (
                <TouchableOpacity
                  style={styles.unsubBtn}
                  onPress={() => handleUnsubscribe(vas.id, vas.name)}
                >
                  <Text style={styles.unsubBtnText}>Remove</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.inactiveBadge}>
                  <Text style={styles.inactiveBadgeText}>Removed</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 16 },
  dataRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  dataUsed: { fontSize: 36, fontWeight: '800', color: '#111827' },
  dataTotal: { fontSize: 14, color: '#6b7280' },
  progressTrack: {
    height: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: { height: '100%', borderRadius: 6 },
  fupStatus: { fontSize: 12, color: '#6b7280' },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditBalance: { fontSize: 24, fontWeight: '800', color: '#16a34a' },
  creditItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  creditLeft: { flex: 1 },
  creditAmount: { fontSize: 14, fontWeight: '700', color: '#16a34a' },
  creditReason: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  creditDate: { fontSize: 12, color: '#9ca3af' },
  vasNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: -8,
    marginBottom: 12,
    lineHeight: 18,
  },
  vasItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  vasLeft: { flex: 1, marginRight: 8 },
  vasNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  vasName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  activeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadgeText: { fontSize: 9, fontWeight: '700', color: '#16a34a' },
  vasCost: { fontSize: 12, color: '#6b7280' },
  unsubBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  unsubBtnText: { color: '#dc2626', fontSize: 12, fontWeight: '700' },
  inactiveBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inactiveBadgeText: { color: '#9ca3af', fontSize: 12 },
});
