import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { authAPI } from '../src/utils/api';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await authAPI.isAuthenticated();
      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/auth');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2e7d32" />
      <Text style={styles.text}>Loading TransportKart...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#2e7d32',
  },
}); 