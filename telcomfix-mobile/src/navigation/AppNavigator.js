import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import { Feather } from '@expo/vector-icons';

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
import AIAssistantScreen from '../screens/engineer/AIAssistantScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter_600SemiBold', paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CustomerHome}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon iconName="home" color={color} /> }}
      />
      <Tab.Screen
        name="TicketTracker"
        component={TicketTrackerScreen}
        options={{ tabBarLabel: 'Tickets', tabBarIcon: ({ color }) => <TabIcon iconName="file-text" color={color} /> }}
      />
      <Tab.Screen
        name="Diagnostic"
        component={DiagnosticScreen}
        options={{ tabBarLabel: 'Diagnose', tabBarIcon: ({ color }) => <TabIcon iconName="activity" color={color} /> }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingScreen}
        options={{ tabBarLabel: 'Billing', tabBarIcon: ({ color }) => <TabIcon iconName="credit-card" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function EngineerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter_600SemiBold', paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="JobQueue"
        component={JobQueueScreen}
        options={{ tabBarLabel: 'Jobs', tabBarIcon: ({ color }) => <TabIcon iconName="tool" color={color} /> }}
      />
      <Tab.Screen
        name="TowerMap"
        component={TowerMapScreen}
        options={{ tabBarLabel: 'Map', tabBarIcon: ({ color }) => <TabIcon iconName="map" color={color} /> }}
      />
      <Tab.Screen
        name="AlarmFeed"
        component={AlarmFeedScreen}
        options={{ tabBarLabel: 'Alarms', tabBarIcon: ({ color }) => <TabIcon iconName="bell" color={color} /> }}
      />
      <Tab.Screen
        name="AIAssistant"
        component={AIAssistantScreen}
        options={{ tabBarLabel: 'AI Insights', tabBarIcon: ({ color }) => <TabIcon iconName="cpu" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// Simple vector icon component
function TabIcon({ iconName, color }) {
  return <Feather name={iconName} size={22} color={color} />;
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
