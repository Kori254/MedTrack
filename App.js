import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans';
import { AppProvider, useApp } from './src/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={{ flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#FBE3DF' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#AE3729', marginBottom: 12 }}>
            Crash — copy this and share it:
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#14211D' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

function Inner() {
  const { isDark, isLoading } = useApp();
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F7F5' }}>
        <ActivityIndicator color="#0F6E56" size="large" />
      </View>
    );
  }
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F7F5' }}>
        <ActivityIndicator color="#0F6E56" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppProvider>
          <Inner />
        </AppProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
