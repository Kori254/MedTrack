import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminProvider, useAdminApp } from './AdminContext';
import { Icons } from '../components/Icons';

import OverviewScreen from './screens/OverviewScreen';
import { CliniciansListScreen, DoctorDetailScreen } from './screens/CliniciansScreen';
import AddDoctorScreen from './screens/AddDoctorScreen';
import { PatientsListScreen, PatientDetailScreen, AssignPatientsScreen } from './screens/PatientsScreen';
import { MoreHubScreen, FacilitiesScreen, RolesScreen, AdminProfileScreen } from './screens/MoreScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, color, size }) {
  const Ic = Icons[name];
  return Ic ? <Ic size={size} color={color} /> : null;
}

function AdminTabs() {
  const { theme: t } = useAdminApp();
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
      <Tab.Screen name="AdminOverview" component={OverviewScreen}
        options={{ title: 'Overview', tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} /> }} />
      <Tab.Screen name="AdminClinicians" component={CliniciansListScreen}
        options={{ title: 'Clinicians', tabBarIcon: ({ color, size }) => <TabIcon name="stethoscope" color={color} size={size} /> }} />
      <Tab.Screen name="AdminPatients" component={PatientsListScreen}
        options={{ title: 'Patients', tabBarIcon: ({ color, size }) => <TabIcon name="users" color={color} size={size} /> }} />
      <Tab.Screen name="AdminMore" component={MoreHubScreen}
        options={{ title: 'More', tabBarIcon: ({ color, size }) => <TabIcon name="dots" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminRoot" component={AdminTabs} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen}
        options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="AddDoctor" component={AddDoctorScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen name="PatientDetail" component={PatientDetailScreen}
        options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="AssignPatients" component={AssignPatientsScreen}
        options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="AdminFacilities" component={FacilitiesScreen}
        options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="AdminRoles" component={RolesScreen}
        options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="AdminProfile" component={AdminProfileScreen}
        options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <AdminProvider>
      <AdminStack />
    </AdminProvider>
  );
}
