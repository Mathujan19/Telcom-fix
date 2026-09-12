import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Safely pull the API key
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export default function AIAssistantScreen() {
  const { state, actions } = useApp();
  const { currentUser } = state;
  
  const [activeTab, setActiveTab] = useState('SIGNAL');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const firstName = currentUser?.name?.split(' ')[0] || 'Eng';
  const initial = firstName.charAt(0).toUpperCase();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    if (!GEMINI_API_KEY) {
      setResult("ERROR: Gemini API Key is missing. Please add it to the .env file.");
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let prompt = '';
      if (activeTab === 'SIGNAL') {
        prompt = `You are an AI assistant for a Telcom Field Engineer. A customer has reported poor connectivity with the following details: "${inputText}". Analyze if this is a real coverage gap / tower issue (like overloaded/maintenance) or just indoor/handset signal loss. Keep your response concise, professional, and actionable. Start with a bold definitive statement.`;
      } else if (activeTab === 'USAGE') {
        prompt = `You are an AI assistant for a Telcom Field Engineer. We are analyzing the data usage pattern of a customer: "${inputText}". Determine if this data drain is normal or if it is abnormal (e.g., background apps, tethering, malware) and flag it before the customer complains. Keep your response concise and professional.`;
      } else {
        prompt = `You are an AI assistant for a Telcom Field Engineer. Review this billing query: "${inputText}". Identify any deductions the package doesn't explain, such as unwanted add-ons or hidden fees. Keep your response concise, clear, and professional.`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setResult(text);
    } catch (error) {
      console.error(error);
      setResult("An error occurred while generating AI insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (activeTab === 'SIGNAL') return "Enter customer's location or symptom (e.g. 'No 4G in basement')";
    if (activeTab === 'USAGE') return "Enter data usage logs or pattern (e.g. 'Used 50GB at 3 AM')";
    return "Enter billing details or package info (e.g. 'Charged LKR 500 for VAS')";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.brandName}>TelcomFix AI</Text>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingBox}>
          <Text style={styles.greetingTitle}>AI Insights</Text>
          <Text style={styles.greetingSub}>Powered by Gemini LLM</Text>
        </View>

        <View style={styles.tabsContainer}>
          {['SIGNAL', 'USAGE', 'BILLING'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => { setActiveTab(tab); setResult(null); setInputText(''); }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather 
              name={activeTab === 'SIGNAL' ? 'radio' : activeTab === 'USAGE' ? 'bar-chart-2' : 'dollar-sign'} 
              size={20} 
              color="#0f766e" 
            />
            <Text style={styles.cardTitle}>{activeTab} · AI</Text>
          </View>
          
          <Text style={styles.cardDesc}>
            {activeTab === 'SIGNAL' && "Separates real coverage gaps/tower issues from indoor or handset signal loss."}
            {activeTab === 'USAGE' && "Flags data drains that don't match the customer's normal pattern before they complain."}
            {activeTab === 'BILLING' && "Finds deductions the package doesn't explain, such as unwanted add-ons."}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={getPlaceholder()}
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.analyzeBtn, !inputText.trim() && styles.analyzeBtnDisabled]} 
            onPress={handleAnalyze}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="cpu" size={18} color="#fff" />
                <Text style={styles.analyzeBtnText}>Generate Insight</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Feather name="zap" size={18} color="#d97706" />
              <Text style={styles.resultTitle}>AI Analysis</Text>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}
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

  scrollContent: { paddingBottom: 40 },

  greetingBox: { paddingHorizontal: 24, marginBottom: 24 },
  greetingTitle: { fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: '#0f172a', letterSpacing: -0.5 },
  greetingSub: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#64748b', marginTop: 4 },

  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  tabText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#64748b' },
  activeTabText: { color: '#0f172a', fontFamily: 'Inter_700Bold' },

  card: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  cardDesc: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748b', marginBottom: 20, lineHeight: 20 },

  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0f172a',
    minHeight: 100,
    marginBottom: 20,
  },

  analyzeBtn: {
    backgroundColor: '#0f766e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  analyzeBtnDisabled: { backgroundColor: '#94a3b8' },
  analyzeBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_700Bold' },

  resultCard: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resultTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#b45309' },
  resultText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#78350f', lineHeight: 22 },
});
