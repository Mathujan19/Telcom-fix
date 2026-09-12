import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { useApp } from '../../context/AppContext';

const CHECKLIST = [
  { id: 'c1', label: 'Power supply verified & restored' },
  { id: 'c2', label: 'Fiber/backhaul connectivity confirmed' },
  { id: 'c3', label: 'Battery bank health checked' },
  { id: 'c4', label: 'Radio units (RU) power cycled' },
  { id: 'c5', label: 'Sector antennas inspected' },
  { id: 'c6', label: 'Post-restoration signal test passed' },
];

export default function JobDetailScreen({ route, navigation }) {
  const { state, dispatch } = useApp();
  const { jobId } = route.params;
  const job = state.jobs.find(j => j.id === jobId);
  const tower = state.towers.find(t => t.id === job?.towerId);

  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState('');
  const [closing, setClosing] = useState(false);
  const [completed, setCompleted] = useState(job?.status === 'COMPLETED');

  if (!job) return (
    <SafeAreaView style={styles.container}>
      <Text style={{ padding: 20, color: '#374151' }}>Job not found.</Text>
    </SafeAreaView>
  );

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const allChecked = CHECKLIST.every(c => checked[c.id]);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const handleClose = () => {
    if (!allChecked) {
      Alert.alert('Incomplete Checklist', 'Please complete all checklist items before closing the job.');
      return;
    }
    Alert.alert(
      'Close Job',
      `Mark JOB ${job.id} as COMPLETED and restore ${job.towerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close & Restore',
          style: 'default',
          onPress: () => {
            setClosing(true);
            setTimeout(() => {
              dispatch({ type: 'CLOSE_JOB', jobId: job.id, towerId: job.towerId });
              setCompleted(true);
              setClosing(false);
            }, 1200);
          },
        },
      ]
    );
  };

  if (completed && job.status === 'COMPLETED') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneIcon}>🎉</Text>
          <Text style={styles.doneTitle}>Job Completed!</Text>
          <Text style={styles.doneSub}>
            {job.towerName} has been restored to OPERATIONAL status.
          </Text>
          <Text style={styles.doneDetail}>
            {job.impactedSubscribers} subscribers reconnected.
          </Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Back to Queue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.jobHeaderTop}>
            <View>
              <Text style={styles.jobId}>{job.id}</Text>
              <Text style={styles.ticketRef}>Ticket: {job.ticketId}</Text>
            </View>
            <View style={[styles.sevBadge, {
              backgroundColor: job.severity === 'Critical Outage' ? '#fef2f2' : '#fffbeb',
            }]}>
              <Text style={[styles.sevText, {
                color: job.severity === 'Critical Outage' ? '#dc2626' : '#d97706',
              }]}>
                {job.severity === 'Critical Outage' ? '🔴' : '🟡'} {job.severity}
              </Text>
            </View>
          </View>
          <Text style={styles.towerName}>{job.towerName}</Text>
          <Text style={styles.towerId}>Site ID: {job.towerId}</Text>
        </View>

        {/* Tower Specs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🗼 Tower Specifications</Text>
          {[
            { label: 'Status', value: tower?.status, colored: true },
            { label: 'Bands', value: job.bands.join(', ') },
            { label: 'Radio Units', value: job.radioUnits },
            { label: 'Battery Type', value: job.batteryType },
            { label: 'Impacted Subscribers', value: job.impactedSubscribers.toLocaleString() },
          ].map((row, i) => (
            <View key={i} style={styles.specRow}>
              <Text style={styles.specLabel}>{row.label}</Text>
              <Text style={[
                styles.specValue,
                row.colored && { color: tower?.status === 'OPERATIONAL' ? '#16a34a' : '#dc2626', fontWeight: '700' },
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Active Alarms */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚨 Active Alarms</Text>
          {[job.alarmCode, job.alarmCode2].filter(Boolean).map((alarm, i) => (
            <View key={i} style={styles.alarmItem}>
              <View style={styles.alarmDot} />
              <View>
                <Text style={styles.alarmCode}>{alarm}</Text>
                <Text style={styles.alarmDesc}>
                  {alarm === 'POWER_LOSS' && 'Main power feed failure. Check generator and grid connection.'}
                  {alarm === 'FIBER_CUT' && 'Backhaul fiber link severed. Locate cut and splice.'}
                  {alarm === 'GENERATOR_FAULT' && 'Generator failed to start. Check fuel and starter motor.'}
                  {alarm === 'BATTERY_LOW' && 'Battery bank below 20%. Immediate replacement needed.'}
                  {alarm === 'HIGH_PACKET_LOSS' && 'Packet loss >30%. Check RF interference and antenna alignment.'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Field Checklist */}
        <View style={styles.card}>
          <View style={styles.checklistHeader}>
            <Text style={styles.cardTitle}>✅ Field Checklist</Text>
            <Text style={styles.checklistProgress}>{checkedCount}/{CHECKLIST.length}</Text>
          </View>
          {CHECKLIST.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkItem}
              onPress={() => toggleCheck(item.id)}
            >
              <View style={[styles.checkbox, checked[item.id] && styles.checkboxDone]}>
                {checked[item.id] && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.checkLabel, checked[item.id] && styles.checkLabelDone]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Field Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Document findings, replacement parts used, unusual observations..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Close Button */}
        <TouchableOpacity
          style={[
            styles.closeBtn,
            !allChecked && styles.closeBtnDisabled,
            closing && styles.closeBtnLoading,
          ]}
          onPress={handleClose}
          disabled={closing}
        >
          <Text style={styles.closeBtnText}>
            {closing ? '⏳ Closing Job...' : allChecked ? '✅ Close Job & Mark Restored' : `Complete checklist to close (${checkedCount}/${CHECKLIST.length})`}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  jobHeader: {
    backgroundColor: '#111827',
    padding: 20,
    paddingTop: 16,
  },
  jobHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobId: { fontSize: 13, fontWeight: '700', color: '#9ca3af', letterSpacing: 1 },
  ticketRef: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  sevBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  sevText: { fontSize: 12, fontWeight: '700' },
  towerName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  towerId: { fontSize: 13, color: '#6b7280' },
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
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 14 },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  specLabel: { fontSize: 13, color: '#6b7280' },
  specValue: { fontSize: 13, fontWeight: '600', color: '#111827', maxWidth: '55%', textAlign: 'right' },
  alarmItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  alarmDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#dc2626',
    marginTop: 4,
  },
  alarmCode: { fontSize: 14, fontWeight: '700', color: '#dc2626', marginBottom: 2 },
  alarmDesc: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  checklistProgress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  checkLabel: { fontSize: 14, color: '#374151', flex: 1 },
  checkLabelDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#111827',
    minHeight: 100,
    backgroundColor: '#f8fafc',
  },
  closeBtn: {
    margin: 16,
    backgroundColor: '#16a34a',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  closeBtnDisabled: { backgroundColor: '#e5e7eb', shadowOpacity: 0 },
  closeBtnLoading: { backgroundColor: '#9ca3af', shadowOpacity: 0 },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  doneIcon: { fontSize: 72, marginBottom: 16 },
  doneTitle: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 8 },
  doneSub: { fontSize: 15, color: '#374151', textAlign: 'center', marginBottom: 8 },
  doneDetail: { fontSize: 13, color: '#16a34a', fontWeight: '600', marginBottom: 32 },
  doneBtn: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
