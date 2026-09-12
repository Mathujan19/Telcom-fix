import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

function AppInner() {
  const { state } = useApp();

  // Show Firebase auth loading splash
  if (state.authLoading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.logo}>📡</Text>
        <Text style={styles.title}>TelcomFix</Text>
        <ActivityIndicator color="#dc2626" size="large" style={{ marginTop: 24 }} />
        <Text style={styles.sub}>Connecting to Firebase...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar style="auto" />
        <AppInner />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: { fontSize: 64 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 12 },
  sub: { fontSize: 13, color: '#9ca3af', marginTop: 12 },
});
