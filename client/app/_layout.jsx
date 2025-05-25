import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2e7d32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'TransportKart',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="auth" 
          options={{ 
            title: 'Login',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Loading Slip Form',
            headerBackVisible: false,
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="receipt-list" 
          options={{ 
            title: 'Receipt List' 
          }} 
        />
        <Stack.Screen 
          name="receipt/[id]" 
          options={{ 
            title: 'Receipt Details' 
          }} 
        />
      </Stack>
    </PaperProvider>
  );
} 