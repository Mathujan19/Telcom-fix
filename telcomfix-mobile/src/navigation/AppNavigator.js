import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
// Customer screens
import CustomerHome from '../screens/customer/HomeScreen';
import ReportIssueScreen from '../screens/customer/ReportIssueScreen';
import TicketTrackerScreen from '../screens/customer/TicketTrackerScreen';
import DiagnosticScreen from '../screens/customer/DiagnosticScreen';
import BillingScreen from '../screens/customer/BillingScreen';
// Engineer screens
import JobQueueScreen from '../screens/engineer/JobQueueScreen';
import JobDetailScreen from '../screens/engineer/JobDetailScreen';
import TowerMapScreen from '../screens/engineer/TowerMapScreen';
import AlarmFeedScreen from '../screens/engineer/AlarmFeedScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#dc2626',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CustomerHome}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} /> }}
      />
      <Tab.Screen
        name="TicketTracker"
        component={TicketTrackerScreen}
        options={{ tabBarLabel: 'Tickets', tabBarIcon: ({ color }) => <TabIcon emoji="🎫" color={color} /> }}
      />
      <Tab.Screen
        name="Diagnostic"
        component={DiagnosticScreen}
        options={{ tabBarLabel: 'Diagnose', tabBarIcon: ({ color }) => <TabIcon emoji="🔬" color={color} /> }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingScreen}
        options={{ tabBarLabel: 'Billing', tabBarIcon: ({ color }) => <TabIcon emoji="💳" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function EngineerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#dc2626',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#374151',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', paddingBottom: 4, color: '#9ca3af' },
        tabBarActiveTintColor: '#f87171',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="JobQueue"
        component={JobQueueScreen}
        options={{ tabBarLabel: 'Jobs', tabBarIcon: ({ color }) => <TabIcon emoji="🔧" color={color} /> }}
      />
      <Tab.Screen
        name="TowerMap"
        component={TowerMapScreen}
        options={{ tabBarLabel: 'Map', tabBarIcon: ({ color }) => <TabIcon emoji="🗺️" color={color} /> }}
      />
      <Tab.Screen
        name="AlarmFeed"
        component={AlarmFeedScreen}
        options={{ tabBarLabel: 'Alarms', tabBarIcon: ({ color }) => <TabIcon emoji="🚨" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// Simple emoji tab icon component
function TabIcon({ emoji, color }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function AppNavigator() {
  const { state } = useApp();
  const { role } = state;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : role === 'customer' ? (
          <>
            <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
            <Stack.Screen
              name="ReportIssue"
              component={ReportIssueScreen}
              options={{
                headerShown: true,
                title: 'Report Issue',
                headerTintColor: '#dc2626',
                headerStyle: { backgroundColor: '#fff' },
              }}
            />
            <Stack.Screen name="TicketTracker" component={TicketTrackerScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="EngineerTabs" component={EngineerTabs} />
            <Stack.Screen
              name="JobDetail"
              component={JobDetailScreen}
              options={{
                headerShown: true,
                title: 'Job Details',
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#111827' },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
