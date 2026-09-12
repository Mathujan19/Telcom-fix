import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export default function DiagnosticScreen() {
  const { dispatch } = useApp();
  const [pingRunning, setPingRunning] = useState(false);
  const [speedRunning, setSpeedRunning] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [speedResult, setSpeedResult] = useState(null);
  const [refreshDone, setRefreshDone] = useState(false);

  const runPing = () => {
    setPingRunning(true);
    setPingResult(null);
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 200) + 20;
      const result = {
        latency,
        packetLoss: latency > 100 ? '12%' : '0%',
        status: latency > 150 ? 'HIGH LATENCY' : 'OK',
      };
      setPingResult(result);
      setPingRunning(false);
      dispatch({ type: 'SET_PING', result });
    }, 2500);
  };

  const runSpeedTest = () => {
    setSpeedRunning(true);
    setSpeedResult(null);
    setTimeout(() => {
      const download = (Math.random() * 50 + 5).toFixed(1);
      const upload = (Math.random() * 20 + 2).toFixed(1);
      const result = {
        download,
        upload,
        rating: download > 25 ? 'Good' : download > 10 ? 'Fair' : 'Poor',
      };
      setSpeedResult(result);
      setSpeedRunning(false);
      dispatch({ type: 'SET_SPEED_TEST', result });
    }, 3000);
  };

  const runRefresh = () => {
    setRefreshDone(false);
    setTimeout(() => setRefreshDone(true), 2000);
  };

  const ratingColor = (r) =>
    r === 'Good' ? '#16a34a' : r === 'Fair' ? '#d97706' : '#dc2626';
  const ratingBg = (r) =>
    r === 'Good' ? '#f0fdf4' : r === 'Fair' ? '#fffbeb' : '#fef2f2';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Network Diagnostics</Text>
          <Text style={styles.subtitle}>Run tests to verify your connection quality</Text>
        </View>

        {/* Ping Test */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🏓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Ping Test</Text>
              <Text style={styles.cardSub}>Measures round-trip latency to network</Text>
            </View>
          </View>

          {pingResult && (
            <View style={styles.resultGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultVal}>{pingResult.latency}ms</Text>
                <Text style={styles.resultLabel}>Latency</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultVal}>{pingResult.packetLoss}</Text>
                <Text style={styles.resultLabel}>Packet Loss</Text>
              </View>
              <View style={[
                styles.resultItem,
                { backgroundColor: pingResult.status === 'OK' ? '#f0fdf4' : '#fef2f2' },
              ]}>
                <Text style={[
                  styles.resultVal,
                  { color: pingResult.status === 'OK' ? '#16a34a' : '#dc2626' },
                ]}>
                  {pingResult.status}
                </Text>
                <Text style={styles.resultLabel}>Status</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.testBtn, pingRunning && styles.runningBtn]}
            onPress={runPing}
            disabled={pingRunning}
          >
            <Text style={styles.testBtnText}>
              {pingRunning ? '🔄 Running Ping...' : '▶ Run Ping Test'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Speed Test */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Speed Test</Text>
              <Text style={styles.cardSub}>Tests download & upload throughput</Text>
            </View>
          </View>

          {speedResult && (
            <View style={styles.resultGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultVal}>{speedResult.download}</Text>
                <Text style={styles.resultLabel}>DL Mbps</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultVal}>{speedResult.upload}</Text>
                <Text style={styles.resultLabel}>UL Mbps</Text>
              </View>
              <View style={[styles.resultItem, { backgroundColor: ratingBg(speedResult.rating) }]}>
                <Text style={[styles.resultVal, { color: ratingColor(speedResult.rating) }]}>
                  {speedResult.rating}
                </Text>
                <Text style={styles.resultLabel}>Rating</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.testBtn, speedRunning && styles.runningBtn]}
            onPress={runSpeedTest}
            disabled={speedRunning}
          >
            <Text style={styles.testBtnText}>
              {speedRunning ? '🔄 Testing Speed...' : '▶ Run Speed Test'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Refresh Carrier Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Refresh Connection</Text>
              <Text style={styles.cardSub}>Push OTA carrier settings update</Text>
            </View>
          </View>

          {refreshDone && (
            <View style={styles.refreshResult}>
              <Text style={styles.refreshText}>✅ Carrier settings refreshed successfully. Please wait 30s for changes to apply.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.testBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={runRefresh}
          >
            <Text style={styles.testBtnText}>🔄 Refresh Carrier Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={[styles.card, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
          <Text style={styles.tipsTitle}>💡 Troubleshooting Tips</Text>
          {[
            'Toggle Airplane Mode off/on to reconnect',
            'Restart device if issues persist after refresh',
            'Check SIM card seating if "No Service" shown',
            'Move to open area for better signal reception',
          ].map((tip, i) => (
            <Text key={i} style={styles.tipItem}>• {tip}</Text>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardIcon: { fontSize: 32 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  resultGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  resultItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultVal: { fontSize: 16, fontWeight: '700', color: '#111827' },
  resultLabel: { fontSize: 10, color: '#9ca3af', marginTop: 4, textAlign: 'center' },
  testBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  runningBtn: { backgroundColor: '#9ca3af' },
  testBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  refreshResult: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  refreshText: { fontSize: 13, color: '#15803d' },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: '#1d4ed8', marginBottom: 10 },
  tipItem: { fontSize: 13, color: '#374151', marginBottom: 6 },
});
