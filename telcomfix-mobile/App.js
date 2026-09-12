import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { Ionicons } from '@expo/vector-icons';

function AppInner() {
  const { state } = useApp();

  // Show Firebase auth loading splash
  if (state.authLoading) {
    return (
      <View style={styles.splash}>
        <Ionicons name="radio-outline" size={64} color="#f43f5e" />
        <Text style={styles.title}>TelcomFix</Text>
        <ActivityIndicator color="#f43f5e" size="large" style={{ marginTop: 24 }} />
        <Text style={styles.sub}>Connecting to Firebase...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
    Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#f43f5e" />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <StatusBar style="auto" />
          <AppInner />
        </AppProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  title: { fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: '#0f172a', marginTop: 12, letterSpacing: -0.5 },
  sub: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#94a3b8', marginTop: 12 },
});
