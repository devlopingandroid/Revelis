import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { Colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <DiscoverScreen />
    </SafeAreaProvider>
  );
}

