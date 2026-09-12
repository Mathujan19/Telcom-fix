import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../../context/AppContext';

const SEVERITY_CONFIG = {
  'Critical Outage': { color: '#dc2626', bg: '#fef2f2', icon: '🔴' },
  'Degraded Hardware': { color: '#d97706', bg: '#fffbeb', icon: '🟡' },
  'Predictive Alert': { color: '#7c3aed', bg: '#f5f3ff', icon: '🟣' },
};

const STATUS_CONFIG = {
  COMPLETED: { bg: '#dcfce7', color: '#16a34a' },
  IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8' },
  PENDING: { bg: '#fef3c7', color: '#d97706' },
};

export default function JobQueueScreen({ navigation }) {
  const { state } = useApp();
  const { jobs, currentUser } = state;
  const myJobs = jobs.filter(j => j.assignedTo === currentUser?.id);

  const renderJob = ({ item: job }) => {
    const sev = SEVERITY_CONFIG[job.severity] || SEVERITY_CONFIG['Degraded Hardware'];
    const st = STATUS_CONFIG[job.status] || STATUS_CONFIG['PENDING'];

    return (
      <TouchableOpacity
        style={[styles.jobCard, { borderLeftColor: sev.color }]}
        onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
        activeOpacity={0.8}
      >
        <View style={styles.jobHeader}>
          <View style={[styles.sevBadge, { backgroundColor: sev.bg }]}>
            <Text style={[styles.sevText, { color: sev.color }]}>
              {sev.icon} {job.severity}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
            <Text style={[styles.statusText, { color: st.color }]}>{job.status}</Text>
          </View>
        </View>

        <Text style={styles.towerName}>{job.towerName}</Text>
        <Text style={styles.siteId}>Site: {job.towerId} · Ticket: {job.ticketId}</Text>

        <View style={styles.alarmRow}>
          <View style={styles.alarmTag}>
            <Text style={styles.alarmTagText}>⚠️ {job.alarmCode}</Text>
          </View>
          {job.alarmCode2 && (
            <View style={styles.alarmTag}>
              <Text style={styles.alarmTagText}>⚠️ {job.alarmCode2}</Text>
            </View>
          )}
        </View>

        <View style={styles.jobFooter}>
          <Text style={styles.impact}>👥 {job.impactedSubscribers} affected</Text>
          <Text style={styles.bands}>📡 {job.bands.join(' + ')}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const pending = myJobs.filter(j => j.status !== 'COMPLETED').length;
  const done = myJobs.filter(j => j.status === 'COMPLETED').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Job Queue</Text>
          <Text style={styles.subtitle}>{pending} open · {done} completed today</Text>
        </View>
        <View style={styles.engineerBadge}>
          <Text style={styles.engineerText}>🔧 ENG</Text>
        </View>
      </View>

      {myJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySub}>No open jobs assigned to you.</Text>
        </View>
      ) : (
        <FlatList
          data={myJobs}
          keyExtractor={j => j.id}
          renderItem={renderJob}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  engineerBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  engineerText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  list: { padding: 16, gap: 12 },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sevBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sevText: { fontSize: 12, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  towerName: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 2 },
  siteId: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
  alarmRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  alarmTag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alarmTagText: { fontSize: 12, color: '#dc2626', fontWeight: '600' },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  impact: { fontSize: 12, color: '#374151', fontWeight: '600' },
  bands: { fontSize: 12, color: '#374151', flex: 1 },
  chevron: { fontSize: 20, color: '#9ca3af' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  emptySub: { fontSize: 14, color: '#6b7280' },
});
