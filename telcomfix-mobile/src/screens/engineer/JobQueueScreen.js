import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, Dimensions
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
  IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8' },
  PENDING: { bg: '#fef3c7', color: '#d97706' },
};

export default function JobQueueScreen({ navigation }) {
  const { state } = useApp();
  const { jobs, currentUser } = state;
  const myJobs = jobs.filter(j => j.assignedTo === currentUser?.id);

  const pending = myJobs.filter(j => j.status !== 'COMPLETED').length;
  const done = myJobs.filter(j => j.status === 'COMPLETED').length;

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
            <Feather name={sev.icon} size={14} color={sev.color} />
            <Text style={[styles.sevText, { color: sev.color }]}>{job.severity}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
            <Text style={[styles.statusText, { color: st.color }]}>{job.status}</Text>
          </View>
        </View>

        <Text style={styles.towerName}>{job.towerName}</Text>
        <Text style={styles.siteId}>Site: {job.towerId} · Ticket: {job.ticketId}</Text>

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
            <Text style={styles.impact}>{job.impactedSubscribers} affected</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="radio" size={14} color="#64748b" />
            <Text style={styles.bands}>{job.bands.join(' + ')}</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#94a3b8" />
        </View>
      </TouchableOpacity>
    );
  };

  // Center of Colombo roughly
  const region = {
    latitude: 6.85,
    longitude: 79.88,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Job Queue</Text>
          <Text style={styles.subtitle}>{pending} open · {done} completed today</Text>
        </View>
        <View style={styles.engineerBadge}>
          <Feather name="tool" size={14} color="#fff" />
          <Text style={styles.engineerText}>ENG</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
        >
          {myJobs.map(job => (
            <Marker
              key={job.id}
              coordinate={{ latitude: job.lat, longitude: job.lng }}
              title={job.towerName}
              description={`Task: ${job.ticketId} - ${job.severity}`}
            >
              <View style={[styles.marker, { backgroundColor: job.status === 'COMPLETED' ? '#16a34a' : '#f43f5e' }]}>
                <Feather name="tool" size={14} color="#fff" />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {myJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="check-circle" size={64} color="#16a34a" style={styles.emptyIcon} />
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
    zIndex: 10,
  },
  title: { fontSize: 22, fontFamily: 'Outfit_700Bold', color: '#0f172a' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748b', marginTop: 2 },
  engineerBadge: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  engineerText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_700Bold' },
  
  mapContainer: { height: height * 0.3, width: '100%', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  map: { ...StyleSheet.absoluteFillObject },
  marker: { padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },

  list: { padding: 16, gap: 12, paddingBottom: 40 },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sevBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sevText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  
  towerName: { fontSize: 17, fontFamily: 'Outfit_700Bold', color: '#0f172a', marginBottom: 2 },
  siteId: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#64748b', marginBottom: 10 },
  
  alarmRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  alarmTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alarmTagText: { fontSize: 12, color: '#dc2626', fontFamily: 'Inter_600SemiBold' },
  
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  impact: { fontSize: 12, color: '#475569', fontFamily: 'Inter_600SemiBold' },
  bands: { fontSize: 12, color: '#475569', fontFamily: 'Inter_600SemiBold' },
  
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontFamily: 'Outfit_700Bold', color: '#0f172a', marginBottom: 4 },
  emptySub: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#64748b' },
});
