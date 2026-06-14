// MedTrack Clinician — navigation: bottom tabs (Today · Refills · Prescribe · Profile)
// with full-screen Chart and Prescribe flow stacked above (no tab bar).
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../AppContext';
import { Icons } from '../components/Icons';
import { REFILLS } from './data';

import RosterScreen from './screens/RosterScreen';
import RefillsScreen from './screens/RefillsScreen';
import PrescribeScreen from './screens/PrescribeScreen';
import ChartScreen from './screens/ChartScreen';
import ClinProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON = { Today: 'stethoscope', Refills: 'inbox', Prescribe: 'pencil', Profile: 'user' };

function TabIcon({ name, color }) {
  const Ic = Icons[TAB_ICON[name]];
  return <Ic size={24} color={color} />;
}

// Prescribe tab renders nothing — tapping it opens the full-screen flow.
function PrescribeTabStub() { return null; }

function ClinicianTabs() {
  const { theme: t } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
        tabBarStyle: {
          backgroundColor: t.tabbarBg,
          borderTopColor: t.hairline,
          borderTopWidth: 1,
          paddingBottom: 24,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.text3,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: 4 },
      })}
    >
      <Tab.Screen name="Today" component={RosterScreen} />
      <Tab.Screen name="Refills" component={RefillsScreen}
        options={{ tabBarBadge: REFILLS.length || undefined, tabBarBadgeStyle: { backgroundColor: t.coral, fontSize: 10 } }} />
      <Tab.Screen name="Prescribe" component={PrescribeTabStub}
        listeners={({ navigation }) => ({
          tabPress: (e) => { e.preventDefault(); navigation.navigate('PrescribeFlow'); },
        })} />
      <Tab.Screen name="Profile" component={ClinProfileScreen} />
    </Tab.Navigator>
  );
}

export default function ClinicianNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={ClinicianTabs} />
      <Stack.Screen name="Chart" component={ChartScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="PrescribeFlow" component={PrescribeScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
