import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export default function AlarmFeedScreen() {
  const { state } = useApp();
  const { alarmEvents, towers } = state;

  const critical = alarmEvents.filter(a => a.severity === 'critical');
  const warning = alarmEvents.filter(a => a.severity === 'warning');

  const getTowerName = (towerId) =>
    towers.find(t => t.id === towerId)?.name || towerId;

  const handleAcknowledge = (alarmId) => {
    Alert.alert('Alarm Acknowledged', `Alarm ${alarmId} marked as acknowledged. NOC notified.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Alarm Feed</Text>
          <Text style={styles.subtitle}>Real-time network event stream</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#fef2f2', borderColor: '#fca5a5' }]}>
            <Text style={[styles.summaryCount, { color: '#dc2626' }]}>{critical.length}</Text>
            <Text style={[styles.summaryLabel, { color: '#dc2626' }]}>Critical</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
            <Text style={[styles.summaryCount, { color: '#d97706' }]}>{warning.length}</Text>
            <Text style={[styles.summaryLabel, { color: '#d97706' }]}>Warning</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
            <Text style={[styles.summaryCount, { color: '#16a34a' }]}>{alarmEvents.length}</Text>
            <Text style={[styles.summaryLabel, { color: '#16a34a' }]}>Total</Text>
          </View>
        </View>

        {/* Live indicator */}
        <View style={styles.liveBar}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE — auto-refreshing every 6s</Text>
        </View>

        {/* Alarm list */}
        {alarmEvents.map((alarm, i) => (
          <View
            key={alarm.id}
            style={[
              styles.alarmCard,
              { borderLeftColor: alarm.severity === 'critical' ? '#dc2626' : '#f59e0b' },
            ]}
          >
            <View style={styles.alarmTop}>
              <View style={styles.alarmLeft}>
                <Text style={styles.alarmType}>{alarm.type.replace(/_/g, ' ')}</Text>
                <Text style={styles.alarmTower}>{getTowerName(alarm.towerId)}</Text>
              </View>
              <View style={styles.alarmRight}>
                <View style={[
                  styles.sevBadge,
                  { backgroundColor: alarm.severity === 'critical' ? '#fef2f2' : '#fffbeb' },
                ]}>
                  <Text style={[
                    styles.sevText,
                    { color: alarm.severity === 'critical' ? '#dc2626' : '#d97706' },
                  ]}>
                    {alarm.severity === 'critical' ? '🔴' : '🟡'} {alarm.severity.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.alarmTime}>{alarm.time}</Text>
              </View>
            </View>

            <View style={styles.alarmMeta}>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>📡 {alarm.towerId}</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>📊 PL: {alarm.packetLoss}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.ackBtn}
              onPress={() => handleAcknowledge(alarm.id)}
            >
              <Text style={styles.ackBtnText}>✓ Acknowledge</Text>
            </TouchableOpacity>
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
    backgroundColor: '#111827',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  summaryRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  summaryCount: { fontSize: 28, fontWeight: '800' },
  summaryLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  liveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  liveText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  alarmCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  alarmTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  alarmLeft: { flex: 1 },
  alarmType: { fontSize: 15, fontWeight: '700', color: '#111827' },
  alarmTower: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  alarmRight: { alignItems: 'flex-end', gap: 4 },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  sevText: { fontSize: 11, fontWeight: '700' },
  alarmTime: { fontSize: 11, color: '#9ca3af' },
  alarmMeta: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  metaChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: { fontSize: 11, color: '#374151', fontWeight: '500' },
  ackBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  ackBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
});
