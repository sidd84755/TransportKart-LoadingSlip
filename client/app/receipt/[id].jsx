import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { receiptsAPI } from '../../src/utils/api';

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReceipt();
    }
  }, [id]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const data = await receiptsAPI.getById(id);
      setReceipt(data.receipt);
    } catch (error) {
      console.error('Fetch receipt error:', error);
      Alert.alert('Error', 'Failed to load receipt details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await receiptsAPI.downloadPDF(id);
      Alert.alert('Success', 'PDF downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Receipt not found</Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>Loading Slip Receipt</Title>
            <Text style={styles.slipNumber}>#{receipt.loadingSlipNo}</Text>
          </View>
          
          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>Loading Date:</Text>
              <Text style={styles.value}>{formatDate(receipt.loadingDate)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Customer Name:</Text>
              <Text style={styles.value}>{receipt.customerName}</Text>
            </View>

            {receipt.customerAddress && (
              <View style={styles.row}>
                <Text style={styles.label}>Customer Address:</Text>
                <Text style={styles.value}>{receipt.customerAddress}</Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route Information</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>From:</Text>
              <Text style={styles.value}>{receipt.fromCity}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>To:</Text>
              <Text style={styles.value}>{receipt.toCity}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>Vehicle Number:</Text>
              <Text style={styles.value}>{receipt.vehicleNumber}</Text>
            </View>

            {receipt.truckType && (
              <View style={styles.row}>
                <Text style={styles.label}>Truck Type:</Text>
                <Text style={styles.value}>{receipt.truckType}</Text>
              </View>
            )}

            {receipt.vehicleType && (
              <View style={styles.row}>
                <Text style={styles.label}>Vehicle Type:</Text>
                <Text style={styles.value}>{receipt.vehicleType}</Text>
              </View>
            )}

            {receipt.driverNumber && (
              <View style={styles.row}>
                <Text style={styles.label}>Driver Number:</Text>
                <Text style={styles.value}>{receipt.driverNumber}</Text>
              </View>
            )}

            {receipt.ownership && (
              <View style={styles.row}>
                <Text style={styles.label}>Ownership:</Text>
                <Text style={styles.value}>{receipt.ownership}</Text>
              </View>
            )}
          </View>

          {receipt.material && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cargo Information</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Material:</Text>
                  <Text style={styles.value}>{receipt.material}</Text>
                </View>
              </View>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Freight:</Text>
              <Text style={styles.amount}>₹{receipt.freight?.toFixed(2) || '0.00'}</Text>
            </View>

            {receipt.detention > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.label}>Detention:</Text>
                <Text style={styles.amount}>₹{receipt.detention?.toFixed(2) || '0.00'}</Text>
              </View>
            )}

            {receipt.advance > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.label}>Advance:</Text>
                <Text style={styles.deduction}>-₹{receipt.advance?.toFixed(2) || '0.00'}</Text>
              </View>
            )}

            <Divider style={styles.paymentDivider} />
            
            <View style={styles.paymentRow}>
              <Text style={styles.balanceLabel}>Balance Amount:</Text>
              <Text style={styles.balanceAmount}>₹{receipt.balance?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>

          {receipt.remarks && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Remarks</Text>
                <Text style={styles.remarks}>{receipt.remarks}</Text>
              </View>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleDownload}
              loading={downloading}
              disabled={downloading}
              style={styles.downloadButton}
              icon="download"
            >
              Download PDF
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.backButton}
              disabled={downloading}
            >
              Back to List
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8e9',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2e7d32',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 8,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  slipNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4caf50',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#e0e0e0',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  amount: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
  },
  deduction: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '600',
  },
  paymentDivider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  balanceLabel: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  remarks: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  downloadButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#2e7d32',
  },
  backButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#2e7d32',
  },
}); 