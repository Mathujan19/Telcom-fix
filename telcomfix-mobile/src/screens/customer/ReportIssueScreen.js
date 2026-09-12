import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput,
} from 'react-native';
import { useApp } from '../../context/AppContext';

const CATEGORIES = [
  { icon: '📶', label: 'Slow / No Internet', color: '#3b82f6' },
  { icon: '📞', label: 'Dropped Voice Calls', color: '#8b5cf6' },
  { icon: '💳', label: 'Unexpected Balance Drain', color: '#f59e0b' },
  { icon: '📡', label: 'No Signal / Tower Down', color: '#ef4444' },
];

export default function ReportIssueScreen({ route, navigation }) {
  const { dispatch } = useApp();
  const [step, setStep] = useState(route.params?.category ? 2 : 1);
  const [category, setCategory] = useState(route.params?.category || null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const newTicket = {
      id: 'TKT-00' + (Math.floor(Math.random() * 90) + 10),
      customerId: 'CUST_001',
      towerIds: ['TOWER_001'],
      category,
      description,
      status: 'AI_DIAGNOSTIC_RUNNING',
      stage: 2,
      checks: {
        coverage: 'PENDING',
        signal: 'PENDING',
        usage: 'PENDING',
        billing: 'PENDING',
        device: 'PENDING',
      },
      resolution: null,
      engineerId: null,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };
    dispatch({ type: 'ADD_TICKET', ticket: newTicket });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Ticket Created!</Text>
          <Text style={styles.successBody}>
            Your issue has been logged. Our AI diagnostic engine is analyzing your connection right now.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('TicketTracker')}
          >
            <Text style={styles.primaryBtnText}>Track My Ticket →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        {[1, 2].map(s => (
          <View key={s} style={[styles.progressStep, step >= s && styles.progressStepActive]} />
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>What's the issue?</Text>
            <Text style={styles.stepSub}>Select the problem category</Text>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.categoryCard,
                  category === cat.label && styles.categorySelected,
                  { borderColor: category === cat.label ? cat.color : '#e2e8f0' },
                ]}
                onPress={() => { setCategory(cat.label); setStep(2); }}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={styles.catLabel}>{cat.label}</Text>
                <Text style={styles.catArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 2 && (
          <View>
            <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.stepTitle}>Describe the issue</Text>
            <Text style={styles.stepSub}>Category: {category}</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Tell us what happened... (e.g. no signal since 8am, app shows 4G but no internet)"
              multiline
              numberOfLines={5}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />

            <View style={styles.hintBox}>
              <Text style={styles.hint}>
                💡 Be specific — our AI uses your description to run targeted diagnostics.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, !description && styles.disabledBtn]}
              onPress={handleSubmit}
              disabled={!description}
            >
              <Text style={styles.primaryBtnText}>Submit Report 🚀</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  progressBar: { flexDirection: 'row', padding: 16, gap: 8 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0' },
  progressStepActive: { backgroundColor: '#dc2626' },
  content: { flex: 1, padding: 16 },
  stepTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  stepSub: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  categorySelected: { backgroundColor: '#fff5f5' },
  catIcon: { fontSize: 28, marginRight: 16 },
  catLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
  catArrow: { fontSize: 24, color: '#9ca3af' },
  backBtn: { marginBottom: 16 },
  backBtnText: { color: '#dc2626', fontWeight: '600', fontSize: 15 },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    fontSize: 14,
    color: '#111827',
    minHeight: 130,
    marginBottom: 12,
  },
  hintBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  hint: { fontSize: 12, color: '#1d4ed8' },
  primaryBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disabledBtn: { backgroundColor: '#e5e7eb' },
  secondaryBtn: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryBtnText: { color: '#374151', fontSize: 14, fontWeight: '600' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { fontSize: 72, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  successBody: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
});
