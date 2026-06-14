import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../AppContext';
import { Icons } from '../components/Icons';
import LoginScreen from '../screens/LoginScreen';

import HomeScreen from '../screens/HomeScreen';
import MedsScreen from '../screens/MedsScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MedDetailScreen from '../screens/MedDetailScreen';
import DoseScreen from '../screens/DoseScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ClinicianNavigator from '../clinician/ClinicianNavigator';
import AdminNavigator from '../admin/AdminNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabBarIcon({ name, color, size }) {
  const Ic = Icons[name];
  return Ic ? <Ic size={size} color={color} /> : null;
}

function HomeTabs() {
  const { theme: t } = useApp();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="home" color={color} size={size} /> }} />
      <Tab.Screen name="Meds" component={MedsScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="capsule" color={color} size={size} /> }} />
      <Tab.Screen name="Delivery" component={DeliveryScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="truck" color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="user" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

// Single NavigationContainer kept alive for the entire session.
// Auth state is handled by swapping Screen sets inside the same Stack,
// which lets React Navigation animate cleanly without tearing down the container.
export default function AppNavigator() {
  const { actions, isLoggedIn, userRole } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // ── Auth screens ──────────────────────────────────────────────────
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  mode="login"
                  onLogin={(phone) => actions.loginWithPhone(phone)}
                  onClinicianLogin={(email, password) => actions.clinicianLogin(email, password)}
                  onNewUser={() => navigation.navigate('Signup')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup" options={{ animation: 'slide_from_right' }}>
              {({ navigation }) => (
                <LoginScreen
                  mode="signup"
                  onLogin={async (phone) => {
                    await actions.signUpWithPhone(phone);
                    navigation.navigate('Onboarding', { phone });
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Onboarding" component={OnboardingScreen}
              options={{ animation: 'slide_from_right', gestureEnabled: false }} />
          </>
        ) : userRole === 'admin' ? (
          // ── Admin app ─────────────────────────────────────────────────────
          <Stack.Screen name="AdminApp" component={AdminNavigator} />
        ) : userRole === 'clinician' ? (
          // ── Clinician app ─────────────────────────────────────────────────
          <Stack.Screen name="ClinicianRoot" component={ClinicianNavigator} />
        ) : (
          // ── Patient app ───────────────────────────────────────────────────
          <>
            <Stack.Screen name="Main" component={HomeTabs} />
            <Stack.Screen name="MedDetail" component={MedDetailScreen}
              options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Dose" component={DoseScreen}
              options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen}
              options={{ animation: 'slide_from_right' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
