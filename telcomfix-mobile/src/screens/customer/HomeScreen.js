import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Animated,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { state } = useApp();
  const { currentUser, towers, tickets } = state;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const myTower = towers.find(t => t.id === currentUser?.towerId);
  const myTickets = tickets.filter(t => t.customerId === currentUser?.id);
  const activeTicket = myTickets.find(t => t.status !== 'RESOLVED');

  useEffect(() => {
    if (myTower?.status === 'OUTAGE') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.03, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [myTower?.status]);

  const issues = [
    { icon: '📶', label: 'Slow / No Internet', color: '#3b82f6' },
    { icon: '📞', label: 'Dropped Voice Calls', color: '#8b5cf6' },
    { icon: '💳', label: 'Unexpected Balance Drain', color: '#f59e0b' },
    { icon: '📡', label: 'No Signal / Tower Down', color: '#ef4444' },
  ];

  const towerStatusColor = myTower?.status === 'OPERATIONAL'
    ? '#22c55e'
    : myTower?.status === 'OUTAGE'
      ? '#ef4444'
      : '#f59e0b';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{currentUser?.name}</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={[styles.dot, { backgroundColor: towerStatusColor }]} />
            <Text style={styles.statusLabel}>{myTower?.status || 'UNKNOWN'}</Text>
          </View>
        </View>

        {/* Outage Alert Banner */}
        {myTower?.status !== 'OPERATIONAL' && (
          <Animated.View
            style={[
              styles.alertBanner,
              { transform: [{ scale: pulseAnim }] },
              myTower?.status === 'OUTAGE'
                ? { backgroundColor: '#fef2f2', borderColor: '#ef4444' }
                : { backgroundColor: '#fffbeb', borderColor: '#f59e0b' },
            ]}
          >
            <Text style={styles.alertIcon}>
              {myTower?.status === 'OUTAGE' ? '🔴' : '🟡'}
            </Text>
            <View style={styles.alertText}>
              <Text style={[
                styles.alertTitle,
                { color: myTower?.status === 'OUTAGE' ? '#dc2626' : '#d97706' },
              ]}>
                {myTower?.status === 'OUTAGE' ? '⚠️ Active Network Outage' : '⚡ Network Degraded'}
              </Text>
              <Text style={styles.alertBody}>
                {myTower?.name} — {myTower?.impactedSubscribers} subscribers affected
              </Text>
              <Text style={styles.etaText}>
                ETA Restoration: ~2 hours · Field team dispatched
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Active Ticket Card */}
        {activeTicket && (
          <TouchableOpacity
            style={styles.ticketCard}
            onPress={() => navigation.navigate('TicketTracker')}
          >
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>Active Ticket: {activeTicket.id}</Text>
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>● LIVE</Text>
              </View>
            </View>
            <Text style={styles.ticketCat}>{activeTicket.category}</Text>
            <Text style={styles.ticketStatus}>
              Stage: {['Report Received', 'AI Diagnostic Running', 'Field Team Assigned', 'Resolved'][activeTicket.stage - 1]}
            </Text>
          </TouchableOpacity>
        )}

        {/* Quick Report */}
        <Text style={styles.sectionTitle}>Report an Issue</Text>
        <View style={styles.issueGrid}>
          {issues.map((issue, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.issueCard, { borderColor: issue.color + '40' }]}
              onPress={() => navigation.navigate('ReportIssue', { category: issue.label })}
            >
              <Text style={styles.issueIcon}>{issue.icon}</Text>
              <Text style={styles.issueLabel}>{issue.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Network Status */}
        <Text style={styles.sectionTitle}>Your Connection</Text>
        <View style={styles.statusCard}>
          {[
            { label: 'Tower', value: myTower?.name },
            { label: 'Bands', value: myTower?.bands?.join(' / ') },
            { label: 'Failure Risk', value: `${Math.round((myTower?.failureRisk || 0) * 100)}%` },
            { label: 'Status', value: myTower?.status, colored: true },
          ].map((row, i) => (
            <View key={i} style={[styles.statusRow, i === 3 && { borderBottomWidth: 0 }]}>
              <Text style={styles.statLabel}>{row.label}</Text>
              <Text style={[
                styles.statValue,
                row.colored && {
                  color: myTower?.status === 'OPERATIONAL' ? '#16a34a' : '#dc2626',
                  fontWeight: '700',
                },
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  greeting: { fontSize: 13, color: '#6b7280' },
  name: { fontSize: 20, fontWeight: '700', color: '#111827' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 11, fontWeight: '600', color: '#374151' },
  alertBanner: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    gap: 12,
  },
  alertIcon: { fontSize: 24 },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '700' },
  alertBody: { fontSize: 13, color: '#374151', marginTop: 2 },
  etaText: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  ticketCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  liveBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  liveText: { color: '#ef4444', fontSize: 11, fontWeight: '700' },
  ticketCat: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  ticketStatus: { fontSize: 13, color: '#dc2626', fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  issueGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  issueCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  issueIcon: { fontSize: 32, marginBottom: 8 },
  issueLabel: { fontSize: 12, fontWeight: '600', color: '#374151', textAlign: 'center' },
  statusCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statLabel: { fontSize: 13, color: '#6b7280' },
  statValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
});
