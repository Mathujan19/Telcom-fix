import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export default function TowerMapScreen({ navigation }) {
  const { state } = useApp();
  const { towers, alarmEvents } = state;

  const outage = towers.filter(t => t.status === 'OUTAGE');
  const degraded = towers.filter(t => t.status === 'DEGRADED');
  const operational = towers.filter(t => t.status === 'OPERATIONAL');

  const statusConfig = {
    OUTAGE: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', icon: '🔴', label: 'OUTAGE' },
    DEGRADED: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '🟡', label: 'DEGRADED' },
    OPERATIONAL: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '🟢', label: 'OK' },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Network Map</Text>
          <Text style={styles.subtitle}>Western Province · Live Status</Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Outage', count: outage.length, color: '#dc2626', bg: '#fef2f2' },
            { label: 'Degraded', count: degraded.length, color: '#d97706', bg: '#fffbeb' },
            { label: 'Operational', count: operational.length, color: '#16a34a', bg: '#f0fdf4' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <Text style={[styles.statCount, { color: s.color }]}>{s.count}</Text>
              <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Visual Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapTitle}>📍 Western Province Coverage Map</Text>
          <Text style={styles.mapSub}>Tap a tower to view details</Text>

          {/* Tower dots grid */}
          <View style={styles.mapGrid}>
            {towers.map((tower) => {
              const cfg = statusConfig[tower.status];
              return (
                <TouchableOpacity
                  key={tower.id}
                  style={[styles.towerDot, { backgroundColor: cfg.bg, borderColor: cfg.border }]}
                  onPress={() => navigation.navigate('JobDetail', {
                    jobId: state.jobs.find(j => j.towerId === tower.id)?.id || 'JOB_001'
                  })}
                >
                  <Text style={styles.towerDotIcon}>{cfg.icon}</Text>
                  <Text style={styles.towerDotName} numberOfLines={2}>{tower.name}</Text>
                  {tower.impactedSubscribers > 0 && (
                    <Text style={styles.towerDotImpact}>
                      {tower.impactedSubscribers} affected
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tower List */}
        <Text style={styles.sectionTitle}>All Towers</Text>
        {towers.map(tower => {
          const cfg = statusConfig[tower.status];
          return (
            <View key={tower.id} style={[styles.towerCard, { borderLeftColor: cfg.color }]}>
              <View style={styles.towerRow}>
                <View style={styles.towerLeft}>
                  <Text style={styles.towerName}>{tower.name}</Text>
                  <Text style={styles.towerId}>{tower.id} · {tower.bands.join('/')}</Text>
                </View>
                <View style={[styles.towerStatus, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.towerStatusText, { color: cfg.color }]}>
                    {cfg.icon} {cfg.label}
                  </Text>
                </View>
              </View>
              {tower.alarms.length > 0 && (
                <View style={styles.alarmTags}>
                  {tower.alarms.map((alarm, i) => (
                    <View key={i} style={styles.alarmTag}>
                      <Text style={styles.alarmTagText}>{alarm}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.towerFooter}>
                <Text style={styles.riskText}>
                  Failure Risk: {Math.round(tower.failureRisk * 100)}%
                </Text>
                {tower.impactedSubscribers > 0 && (
                  <Text style={styles.impactText}>
                    👥 {tower.impactedSubscribers} affected
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        {/* Live Alarm Feed */}
        <Text style={styles.sectionTitle}>Live Alarm Feed</Text>
        <View style={styles.alarmFeed}>
          {alarmEvents.slice(0, 8).map((alarm, i) => (
            <View key={alarm.id} style={[styles.alarmRow, i === 0 && { borderTopWidth: 0 }]}>
              <View style={[
                styles.alarmSevDot,
                { backgroundColor: alarm.severity === 'critical' ? '#dc2626' : '#f59e0b' },
              ]} />
              <View style={styles.alarmBody}>
                <Text style={styles.alarmType}>{alarm.type}</Text>
                <Text style={styles.alarmMeta}>{alarm.towerId} · {alarm.time} · PL: {alarm.packetLoss}</Text>
              </View>
              <Text style={[
                styles.alarmSevLabel,
                { color: alarm.severity === 'critical' ? '#dc2626' : '#d97706' },
              ]}>
                {alarm.severity.toUpperCase()}
              </Text>
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
    backgroundColor: '#111827',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statCount: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  mapPlaceholder: {
    margin: 16,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    marginTop: 0,
  },
  mapTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  mapSub: { fontSize: 12, color: '#6b7280', marginBottom: 16 },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  towerDot: {
    width: '30%',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  towerDotIcon: { fontSize: 20, marginBottom: 4 },
  towerDotName: { fontSize: 10, fontWeight: '600', color: '#374151', textAlign: 'center' },
  towerDotImpact: { fontSize: 9, color: '#dc2626', marginTop: 2, fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  towerCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  towerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  towerLeft: { flex: 1 },
  towerName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  towerId: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  towerStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  towerStatusText: { fontSize: 11, fontWeight: '700' },
  alarmTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  alarmTag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  alarmTagText: { fontSize: 10, color: '#dc2626', fontWeight: '600' },
  towerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  riskText: { fontSize: 11, color: '#6b7280' },
  impactText: { fontSize: 11, color: '#dc2626', fontWeight: '600' },
  alarmFeed: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  alarmSevDot: { width: 8, height: 8, borderRadius: 4 },
  alarmBody: { flex: 1 },
  alarmType: { fontSize: 13, fontWeight: '600', color: '#111827' },
  alarmMeta: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  alarmSevLabel: { fontSize: 10, fontWeight: '700' },
});
