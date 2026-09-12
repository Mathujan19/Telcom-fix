import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { actions } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer'); // default role

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) return;
    setLoading(true);
    try {
      if (isLogin) {
        await actions.login(email, password);
      } else {
        await actions.signUp(email, password, role, name);
      }
    } catch (err) {
      console.warn('Authentication error:', err?.message);
      alert(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    try {
      await actions.demoLogin(demoRole);
    } catch (err) {
      console.warn('Demo login error:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Ionicons name="radio-outline" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>TelcomFix</Text>
            <Text style={styles.subtitle}>Detecting & Fixing Mobile Service Problems at Scale</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputBox}>
                  <Feather name="user" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputBox}>
                <Feather name="mail" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputBox}>
                <Feather name="lock" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>I am a...</Text>
                <View style={styles.roleSelect}>
                  <TouchableOpacity
                    style={[styles.roleOpt, role === 'customer' && styles.roleOptActive]}
                    onPress={() => setRole('customer')}
                  >
                    <Text style={[styles.roleOptText, role === 'customer' && styles.roleOptTextActive]}>Customer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleOpt, role === 'engineer' && styles.roleOptActive]}
                    onPress={() => setRole('engineer')}
                  >
                    <Text style={[styles.roleOptText, role === 'engineer' && styles.roleOptTextActive]}>Field Engineer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <Text style={styles.primaryBtnText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>For Testing / Demo:</Text>
              <View style={styles.demoButtons}>
                <TouchableOpacity style={styles.demoBtn} onPress={() => handleDemoLogin('customer')}>
                  <Text style={styles.demoBtnText}>Demo as Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.demoBtn} onPress={() => handleDemoLogin('engineer')}>
                  <Text style={styles.demoBtnText}>Demo as Engineer</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: '#0f766e',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0f766e', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  title: { fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: '#0f172a', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748b', marginTop: 6, textAlign: 'center' },
  
  formContainer: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16, elevation: 4 },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#64748b' },
  toggleTextActive: { color: '#0f172a' },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#475569', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, height: 48 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: '#0f172a', height: '100%' },

  roleSelect: { flexDirection: 'row', gap: 12 },
  roleOpt: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  roleOptActive: { borderColor: '#0f766e', backgroundColor: '#f0fdfa' },
  roleOptText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#64748b' },
  roleOptTextActive: { color: '#0f766e' },

  primaryBtn: { backgroundColor: '#0f766e', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },

  demoBox: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center' },
  demoTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#94a3b8', marginBottom: 12 },
  demoButtons: { flexDirection: 'row', gap: 12 },
  demoBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#f1f5f9', borderRadius: 8 },
  demoBtnText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#475569' },
});
