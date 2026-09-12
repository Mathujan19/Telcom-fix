import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { useApp } from '../../context/AppContext';

const STAGES = [
  { label: 'Report Received', icon: '📥', desc: 'Your complaint has been logged in our system.' },
  { label: 'AI Diagnostic Running', icon: '🤖', desc: 'Analyzing coverage, signal, usage, billing & device data.' },
  { label: 'Auto-Fix / Technician Assigned', icon: '🔧', desc: 'Automated action taken or field engineer dispatched.' },
  { label: 'Resolved', icon: '✅', desc: 'Issue has been fixed. Summary below.' },
];

function getCheckColor(val) {
  if (val === 'OK') return '#16a34a';
  if (val === 'PENDING') return '#9ca3af';
  return '#dc2626';
}

function getCheckLabel(val) {
  if (val === 'OK') return '✓ OK';
  if (val === 'PENDING') return '⏳ Checking';
  return '⚠️ ' + val.replace(/_/g, ' ');
}

export default function TicketTrackerScreen() {
  const { state } = useApp();
  const { tickets, currentUser } = state;
  const myTickets = tickets.filter(t => t.customerId === currentUser?.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Tickets</Text>
          <Text style={styles.subtitle}>{myTickets.length} total</Text>
        </View>

        {myTickets.map(ticket => (
          <View key={ticket.id} style={styles.ticketCard}>
            {/* Card header */}
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketId}>{ticket.id}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: ticket.stage === 4 ? '#dcfce7' : '#fef3c7' },
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  { color: ticket.stage === 4 ? '#16a34a' : '#d97706' },
                ]}>
                  {ticket.stage === 4 ? 'RESOLVED' : 'IN PROGRESS'}
                </Text>
              </View>
            </View>
            <Text style={styles.ticketCat}>{ticket.category}</Text>

            {/* Stage Stepper */}
            <View style={styles.stepper}>
              {STAGES.map((stage, i) => {
                const isDone = ticket.stage > i + 1;
                const isActive = ticket.stage === i + 1;
                return (
                  <View key={i} style={styles.stepRow}>
                    <View style={styles.stepLeft}>
                      <View style={[
                        styles.stepCircle,
                        isDone ? styles.stepDone : isActive ? styles.stepActive : styles.stepPending,
                      ]}>
                        <Text style={styles.stepNum}>{isDone ? '✓' : i + 1}</Text>
                      </View>
                      {i < 3 && (
                        <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                      )}
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                        {stage.icon} {stage.label}
                      </Text>
                      {isActive && <Text style={styles.stepDesc}>{stage.desc}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Diagnostic Checks */}
            <Text style={styles.checksTitle}>Diagnostic Checks</Text>
            <View style={styles.checksGrid}>
              {Object.entries(ticket.checks).map(([key, val]) => (
                <View key={key} style={styles.checkItem}>
                  <Text style={[styles.checkVal, { color: getCheckColor(val) }]}>
                    {getCheckLabel(val)}
                  </Text>
                  <Text style={styles.checkKey}>{key.toUpperCase()}</Text>
                </View>
              ))}
            </View>

            {/* Resolution */}
            {ticket.resolution && (
              <View style={styles.resolutionBox}>
                <Text style={styles.resTitle}>📋 Resolution Summary</Text>
                <Text style={styles.resBody}>{ticket.resolution}</Text>
              </View>
            )}
          </View>
        ))}

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
  ticketCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketId: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  ticketCat: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  stepper: { marginBottom: 16 },
  stepRow: { flexDirection: 'row', marginBottom: 4 },
  stepLeft: { alignItems: 'center', width: 32, marginRight: 12 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: { backgroundColor: '#16a34a' },
  stepActive: { backgroundColor: '#dc2626' },
  stepPending: { backgroundColor: '#e5e7eb' },
  stepNum: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 2,
    minHeight: 20,
  },
  stepLineDone: { backgroundColor: '#16a34a' },
  stepContent: { flex: 1, paddingTop: 4, paddingBottom: 8 },
  stepLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  stepLabelActive: { color: '#dc2626' },
  stepDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  checksTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  checkItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flex: 1,
  },
  checkVal: { fontSize: 11, fontWeight: '700' },
  checkKey: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  resolutionBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  resTitle: { fontSize: 13, fontWeight: '700', color: '#16a34a', marginBottom: 6 },
  resBody: { fontSize: 13, color: '#374151', lineHeight: 20 },
});
