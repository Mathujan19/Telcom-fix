import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { state, actions } = useApp();
  const { currentUser, towers, tickets } = state;

  const myTower = towers.find(t => t.id === currentUser?.towerId);
  const myTickets = tickets.filter(t => t.customerId === currentUser?.id);

  // Derive status UI
  const isOperational = myTower?.status === 'OPERATIONAL';
  const statusTitle = isOperational ? 'All systems normal' : (myTower?.status === 'OUTAGE' ? 'Active network outage' : 'Network degraded');
  const statusColor = isOperational ? '#4ade80' : (myTower?.status === 'OUTAGE' ? '#f87171' : '#fbbf24');
  
  const capacity = myTower ? Math.round((1 - myTower.failureRisk) * 100) : 100;
  
  const firstName = currentUser?.name?.split(' ')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();

  const getStatusPill = (stage, status) => {
    if (status === 'RESOLVED') return { text: 'Resolved', color: '#16a34a', bg: '#dcfce7' };
    if (stage === 1) return { text: 'Checking', color: '#d97706', bg: '#fef3c7' };
    if (stage === 2) return { text: 'Diagnosing', color: '#0284c7', bg: '#e0f2fe' };
    return { text: 'Fixing', color: '#9333ea', bg: '#f3e8ff' };
  };

  const getTicketIcon = (category) => {
    if (category.includes('Call')) return <Feather name="phone-call" size={18} color="#db2777" />;
    if (category.includes('Internet')) return <Feather name="wifi" size={18} color="#2563eb" />;
    if (category.includes('Balance')) return <Feather name="credit-card" size={18} color="#ea580c" />;
    return <Feather name="radio" size={18} color="#64748b" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
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

        {/* Greeting */}
        <View style={styles.greetingBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.greetingTitle}>Hi {firstName}</Text>
            <Feather name="sun" size={24} color="#f59e0b" />
          </View>
          <Text style={styles.greetingSub}>Here's how your service looks today.</Text>
        </View>

        {/* Main Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>MY SERVICE STATUS</Text>
            <Ionicons name="cellular" size={20} color="#5eead4" />
          </View>
          
          <View style={styles.cardBody}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={styles.statusMainText}>{statusTitle}</Text>
          </View>

          <Text style={styles.cardFooterText}>
            {myTower?.name || 'Unknown Zone'} · {myTower?.bands?.join('/')} · {capacity}% capacity
          </Text>
        </View>

        {/* Report Button */}
        <TouchableOpacity 
          style={styles.reportBtn}
          onPress={() => navigation.navigate('ReportIssue')}
        >
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.reportBtnText}>Report a problem</Text>
        </TouchableOpacity>

        {/* Recent Reports Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent reports</Text>
          <Text style={styles.sectionCount}>{myTickets.length} total</Text>
        </View>

        {/* Reports List */}
        {myTickets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Feather name="check-circle" size={24} color="#94a3b8" />
            <Text style={styles.emptyText}>No recent issues reported.</Text>
          </View>
        ) : (
          myTickets.map(ticket => {
            const pill = getStatusPill(ticket.stage, ticket.status);
            return (
              <TouchableOpacity 
                key={ticket.id} 
                style={styles.ticketCard}
                onPress={() => navigation.navigate('TicketTracker')}
              >
                <View style={styles.ticketIconBox}>
                  {getTicketIcon(ticket.category)}
                </View>
                
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketName}>{ticket.category}</Text>
                  <Text style={styles.ticketMeta}>{ticket.id} · {ticket.time || 'Recent'}</Text>
                </View>

                <View style={[styles.pill, { backgroundColor: pill.bg, borderColor: pill.color + '40' }]}>
                  <View style={[styles.pillDot, { backgroundColor: pill.color }]} />
                  <Text style={[styles.pillText, { color: pill.color }]}>{pill.text}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scroll: { padding: 24, paddingBottom: 40 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' },
  brandName: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#0f172a' },
  avatarBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ccfbf1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0f766e', fontSize: 14, fontFamily: 'Inter_700Bold' },

  greetingBox: { marginBottom: 24 },
  greetingTitle: { fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: '#0f172a', letterSpacing: -0.5 },
  greetingSub: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#64748b', marginTop: 4 },

  statusCard: {
    backgroundColor: '#0f766e',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#0f766e',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { color: '#5eead4', fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },
  cardBody: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  statusMainText: { color: '#fff', fontSize: 22, fontFamily: 'Inter_700Bold' },
  cardFooterText: { color: '#99f6e4', fontSize: 13, fontFamily: 'Inter_500Medium' },

  reportBtn: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  reportBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  sectionCount: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#94a3b8' },

  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  ticketIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  ticketInfo: { flex: 1 },
  ticketName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#0f172a', marginBottom: 4 },
  ticketMeta: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#94a3b8' },
  
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1,
  },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  emptyCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 32,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed',
  },
  emptyText: { marginTop: 12, fontSize: 14, fontFamily: 'Inter_500Medium', color: '#64748b' },
});
