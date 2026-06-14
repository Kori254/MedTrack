import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabBarIcon({ name, color, size }) {
  const Ic = Icons[name];
  return Ic ? <Ic size={size} color={color} /> : null;
}

function HomeTabs() {
  const { state, theme: t } = useApp();
  const unread = state.notifications.filter((n) => n.unread).length;

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

export default function AppNavigator() {
  const { theme: t, isLoggedIn, userRole, actions } = useApp();

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* 1. Sign in — patient OTP or clinician email+password */}
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
          {/* 2. Sign up (new patient only) */}
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
          {/* 3. Onboarding (profile + prescription, after signup) */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen}
            options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Clinician gets their own root navigator — no patient tabs
  if (userRole === 'clinician') {
    return (
      <NavigationContainer>
        <ClinicianNavigator />
      </NavigationContainer>
    );
  }

  // Patient app
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="MedDetail" component={MedDetailScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Dose" component={DoseScreen} options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
