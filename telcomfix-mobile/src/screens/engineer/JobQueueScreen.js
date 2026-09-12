import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, Dimensions
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

const { height } = Dimensions.get('window');

const SEVERITY_CONFIG = {
  'Critical Outage': { color: '#dc2626', bg: '#fef2f2', icon: 'alert-triangle' },
  'Degraded Hardware': { color: '#d97706', bg: '#fffbeb', icon: 'activity' },
  'Predictive Alert': { color: '#7c3aed', bg: '#f5f3ff', icon: 'eye' },
};

const STATUS_CONFIG = {
  COMPLETED: { bg: '#dcfce7', color: '#16a34a' },
  IN_PROGRESS: { bg: '#e0f2fe', color: '#0284c7' },
  PENDING: { bg: '#fef3c7', color: '#d97706' },
};

export default function JobQueueScreen({ navigation }) {
  const { state, actions } = useApp();
  const { jobs, currentUser } = state;

  const assignedJobs = jobs.filter(j => j.assignedTo === currentUser?.id);
  const myJobs = assignedJobs.length > 0 ? assignedJobs : jobs;

  const pending = myJobs.filter(j => j.status !== 'COMPLETED').length;
  const done = myJobs.filter(j => j.status === 'COMPLETED').length;
  
  const firstName = currentUser?.name?.split(' ')[0] || 'Eng';
  const initial = firstName.charAt(0).toUpperCase();

  const renderJob = ({ item: job }) => {
    const sev = SEVERITY_CONFIG[job.severity] || SEVERITY_CONFIG['Degraded Hardware'];
    const st = STATUS_CONFIG[job.status] || STATUS_CONFIG['PENDING'];

    return (
      <TouchableOpacity
        style={styles.jobCard}
        onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
        activeOpacity={0.8}
      >
        <View style={styles.jobHeader}>
          <View style={[styles.pill, { backgroundColor: sev.bg }]}>
            <Feather name={sev.icon} size={12} color={sev.color} />
            <Text style={[styles.pillText, { color: sev.color }]}>{job.severity}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: st.bg }]}>
            <Text style={[styles.pillText, { color: st.color }]}>{job.status}</Text>
          </View>
        </View>

        <Text style={styles.towerName}>{job.towerName}</Text>
        <Text style={styles.siteId}>{job.towerId} · TKT: {job.ticketId}</Text>

        <View style={styles.alarmRow}>
          <View style={styles.alarmTag}>
            <Feather name="alert-circle" size={12} color="#dc2626" />
            <Text style={styles.alarmTagText}>{job.alarmCode}</Text>
          </View>
          {job.alarmCode2 && (
            <View style={styles.alarmTag}>
              <Feather name="alert-circle" size={12} color="#dc2626" />
              <Text style={styles.alarmTagText}>{job.alarmCode2}</Text>
            </View>
          )}
        </View>

        <View style={styles.jobFooter}>
          <View style={styles.footerItem}>
            <Feather name="users" size={14} color="#64748b" />
            <Text style={styles.footerText}>{job.impactedSubscribers} affected</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="radio" size={14} color="#64748b" />
            <Text style={styles.footerText}>{job.bands.join(' + ')}</Text>
          </View>
          <Feather name="arrow-right" size={18} color="#0f766e" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.greetingTitle}>Hi {firstName}</Text>
        <Text style={styles.greetingSub}>{pending} open · {done} completed today</Text>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Feather name="map" size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
          <Text style={styles.mapPlaceholderText}>Live Map View</Text>
          <Text style={styles.mapPlaceholderSub}>Interactive maps available in native app</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Assigned Jobs</Text>
      </View>

      {myJobs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Feather name="check-circle" size={32} color="#0f766e" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptyText}>No open jobs assigned to you.</Text>
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

  mapContainer: { height: height * 0.22, paddingHorizontal: 24, marginBottom: 24 },
  mapPlaceholder: {
    flex: 1, backgroundColor: '#fff', borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  mapPlaceholderText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  mapPlaceholderSub: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#94a3b8', marginTop: 4 },

  sectionHeader: { paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0f172a' },

  list: { paddingHorizontal: 24, gap: 12, paddingBottom: 40 },
  
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pillText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  
  towerName: { fontSize: 17, fontFamily: 'Outfit_700Bold', color: '#0f172a', marginBottom: 2 },
  siteId: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748b', marginBottom: 12 },
  
  alarmRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  alarmTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1, borderColor: '#fca5a5',
  },
  alarmTagText: { fontSize: 11, color: '#dc2626', fontFamily: 'Inter_600SemiBold' },
  
  jobFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  footerText: { fontSize: 12, color: '#475569', fontFamily: 'Inter_600SemiBold' },
  
  emptyCard: {
    marginHorizontal: 24, backgroundColor: '#fff', borderRadius: 16, padding: 32,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed',
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#0f172a', marginBottom: 4 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#64748b' },
});
