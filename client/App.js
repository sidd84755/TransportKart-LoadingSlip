import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';

const theme = {
  colors: {
    primary: '#2e7d32',
    primaryContainer: '#66bb6a',
    secondary: '#4caf50',
    secondaryContainer: '#81c784',
    surface: '#ffffff',
    surfaceVariant: '#f1f8e9',
    background: '#f5f5f5',
    error: '#d32f2f',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#1c1b1f',
    onBackground: '#1c1b1f',
    outline: '#79747e',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <Slot />
    </PaperProvider>
  );
} 