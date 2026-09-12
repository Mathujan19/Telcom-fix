import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function TowerMapScreen({ navigation }) {
  const { state, actions } = useApp();
  const { towers, alarmEvents, currentUser } = state;

  const outage = towers.filter(t => t.status === 'OUTAGE');
  const degraded = towers.filter(t => t.status === 'DEGRADED');
  const operational = towers.filter(t => t.status === 'OPERATIONAL');

  const statusConfig = {
    OUTAGE: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', icon: 'alert-octagon', label: 'OUTAGE' },
    DEGRADED: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: 'alert-triangle', label: 'DEGRADED' },
    OPERATIONAL: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'check-circle', label: 'OK' },
  };
  
  const firstName = currentUser?.name?.split(' ')[0] || 'Eng';
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>T</Text>
            </View>
            <Text style={styles.brandName}>TelcomFix</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <TouchableOpacity onPress={() => actions.logout()}>
              <Feather name="log-out" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingBox}>
          <Text style={styles.greetingTitle}>Network Map</Text>
          <Text style={styles.greetingSub}>Western Province · Live Status</Text>
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
          <View style={styles.mapHeaderRow}>
            <Feather name="map-pin" size={16} color="#0f766e" />
            <Text style={styles.mapTitle}>Western Province Coverage</Text>
          </View>
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
                  <Feather name={cfg.icon} size={18} color={cfg.color} style={{ marginBottom: 4 }} />
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Towers</Text>
        </View>
        {towers.map(tower => {
          const cfg = statusConfig[tower.status];
          return (
            <View key={tower.id} style={styles.towerCard}>
              <View style={styles.towerRow}>
                <View style={styles.towerLeft}>
                  <Text style={styles.towerName}>{tower.name}</Text>
                  <Text style={styles.towerId}>{tower.id} · {tower.bands.join('/')}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
                  <Feather name={cfg.icon} size={12} color={cfg.color} />
                  <Text style={[styles.pillText, { color: cfg.color }]}>{cfg.label}</Text>
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
                <View style={styles.footerItem}>
                  <Feather name="activity" size={14} color="#64748b" />
                  <Text style={styles.riskText}>Risk: {Math.round(tower.failureRisk * 100)}%</Text>
                </View>
                {tower.impactedSubscribers > 0 && (
                  <View style={styles.footerItem}>
                    <Feather name="users" size={14} color="#dc2626" />
                    <Text style={styles.impactText}>{tower.impactedSubscribers} affected</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Live Alarm Feed */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Alarm Feed</Text>
        </View>
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
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' },
  brandName: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#0f172a' },
  avatarBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ccfbf1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0f766e', fontSize: 14, fontFamily: 'Inter_700Bold' },

  greetingBox: { paddingHorizontal: 24, marginBottom: 24 },
  greetingTitle: { fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: '#0f172a', letterSpacing: -0.5 },
  greetingSub: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#64748b', marginTop: 4 },

  statsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, borderRadius: 16, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#e2e8f0'
  },
  statCount: { fontSize: 24, fontFamily: 'Outfit_800ExtraBold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', marginTop: 4 },

  mapPlaceholder: {
    marginHorizontal: 24, backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  mapHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  mapTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  mapSub: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#94a3b8', marginBottom: 16 },
  
  mapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  towerDot: {
    width: '31%', borderRadius: 12, padding: 10, alignItems: 'center',
    borderWidth: 1,
  },
  towerDotName: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#374151', textAlign: 'center' },
  towerDotImpact: { fontSize: 9, color: '#dc2626', marginTop: 2, fontFamily: 'Inter_700Bold' },

  sectionHeader: { paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  
  towerCard: {
    marginHorizontal: 24, marginBottom: 12, backgroundColor: '#fff',
    borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  towerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  towerLeft: { flex: 1 },
  towerName: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#0f172a' },
  towerId: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#64748b', marginTop: 2 },
  
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pillText: { fontSize: 11, fontFamily: 'Inter_700Bold' },

  alarmTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  alarmTag: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fca5a5' },
  alarmTagText: { fontSize: 10, color: '#dc2626', fontFamily: 'Inter_600SemiBold' },
  
  towerFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  riskText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#64748b' },
  impactText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#dc2626' },
  
  alarmFeed: {
    marginHorizontal: 24, backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden',
  },
  alarmRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  alarmSevDot: { width: 8, height: 8, borderRadius: 4 },
  alarmBody: { flex: 1 },
  alarmType: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#0f172a' },
  alarmMeta: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#94a3b8', marginTop: 2 },
  alarmSevLabel: { fontSize: 10, fontFamily: 'Inter_700Bold' },
});
