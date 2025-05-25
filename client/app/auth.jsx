import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  Divider,
  Text 
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { authAPI } from '../src/utils/api';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await authAPI.login(username, password);
      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed', 
        error.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.header}>
              <Title style={styles.title}>SmART-EMS</Title>
              <Text style={styles.subtitle}>TRANSPORTKART</Text>
              <Paragraph style={styles.description}>
                Loading Slip Management System
              </Paragraph>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.form}>
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                disabled={loading}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                disabled={loading}
              />
              
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Contact: connect@transportkart.com | +917827568795
              </Text>
              <Text style={styles.footerText}>
                www.transportkart.com
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f8e9',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    elevation: 8,
    borderRadius: 12,
  },
  cardContent: {
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#e0e0e0',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
}); 