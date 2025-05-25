import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
      setReceipt(data);
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
      // Get PDF data from API
      const pdfData = await receiptsAPI.downloadPDF(id);
      
      // Create file name with loading slip number
      const fileName = `LoadingSlip_${receipt.loadingSlipNo?.replace(/\//g, '_')}_${Date.now()}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Convert blob to base64 and save file
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfData);
      });
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Check if sharing is available and share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Loading Slip PDF',
        });
        Alert.alert('Success', 'PDF downloaded and ready to share!');
      } else {
        Alert.alert('Success', `PDF saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again.');
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
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.landscapeContainer}>
          <Card style={styles.receiptCard}>
            <Card.Content style={styles.cardContent}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.logoSection}>
                  <Text style={styles.logoText}>🚛</Text>
                  <Text style={styles.logoSubtext}>TRANSPORTKART</Text>
                </View>
                
                <View style={styles.contactSection}>
                  <Text style={styles.contactHeader}>SmART-EMS</Text>
                  <Text style={styles.companyName}>TRANSPORTKART</Text>
                  <Text style={styles.contactText}>📧 connect@transportkart.com</Text>
                  <Text style={styles.contactText}>📞 +91-7927568785</Text>
                  <Text style={styles.contactText}>🌐 www.transportkart.com</Text>
                </View>
              </View>

              {/* Company Details */}
              <View style={styles.companyDetails}>
                <Text style={styles.addressText}>
                  Reg. Office: H-48, Shram Colony, Loni, Ghaziabad, Uttar Pradesh - 201102
                </Text>
                <Text style={styles.regText}>
                  GSTIN: 09DTIPK6278L1ZU | PAN No: DTIPK6278L
                </Text>
              </View>

              <Divider style={styles.divider} />

              {/* Customer and Loading Details - Landscape Layout */}
              <View style={styles.customerSection}>
                <View style={styles.customerInfo}>
                  <Text style={styles.label}>Customer Name:</Text>
                  <Text style={styles.value}>{receipt.customerName}</Text>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>{receipt.customerAddress}</Text>
                </View>
                
                <View style={styles.loadingInfo}>
                  <Text style={styles.label}>Loading Slip No.:</Text>
                  <Text style={styles.value}>{receipt.loadingSlipNo}</Text>
                  <Text style={styles.label}>Loading Date:</Text>
                  <Text style={styles.value}>{formatDate(receipt.loadingDate)}</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Formal Letter */}
              <View style={styles.letterSection}>
                <Text style={styles.letterGreeting}>Dear Sir / Madam,</Text>
                <Text style={styles.letterBody}>
                  We are sending our truck based on our earlier discussion regarding the same. Requesting you please prepare load for the below truck on our behalf & oblige. Upcoming loading on Dated: {formatDate(receipt.loadingDate)}
                </Text>
              </View>

              {/* Details Table - Optimized for Landscape */}
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Load Type</Text>
                  <Text style={styles.tableHeaderText}>From - To City</Text>
                  <Text style={styles.tableHeaderText}>Vehicle No.</Text>
                  <Text style={styles.tableHeaderText}>Driver No.</Text>
                  <Text style={styles.tableHeaderText}>Vehicle Type</Text>
                  <Text style={styles.tableHeaderText}>Material Wt</Text>
                  <Text style={styles.tableHeaderText}>Material</Text>
                  <Text style={styles.tableHeaderText}>Freight</Text>
                </View>
                
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellText}>{receipt.truckType || 'Full Load'}</Text>
                  <Text style={styles.tableCellText}>{receipt.fromCity} - {receipt.toCity}</Text>
                  <Text style={styles.tableCellText}>{receipt.vehicleNo}</Text>
                  <Text style={styles.tableCellText}>{receipt.driverNumber}</Text>
                  <Text style={styles.tableCellText}>{receipt.vehicleType}</Text>
                  <Text style={styles.tableCellText}>-</Text>
                  <Text style={styles.tableCellText}>{receipt.material}</Text>
                  <Text style={styles.tableCellText}>₹{receipt.freight}</Text>
                </View>
              </View>

              {/* Payment Information - Side by Side in Landscape */}
              <View style={styles.paymentSectionLandscape}>
                <View style={styles.paymentLeft}>
                  <Text style={styles.paymentHeader}>Bank Information For Payment</Text>
                  <Text style={styles.paymentText}>Payee Name: SMART EMS</Text>
                  <Text style={styles.paymentText}>Account Number: 459900510005224</Text>
                  <Text style={styles.paymentText}>IFSC Code: PUNJAB45990</Text>
                  <Text style={styles.paymentText}>OR ID: transportkart@axisbank</Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentHeader}>Payment Details</Text>
                  <Text style={styles.detentionText}>Loading Detention: ₹{receipt.detention || '0.00'}</Text>
                  <Text style={styles.advanceText}>Advance Payment: ₹{receipt.advance || '0.00'}</Text>
                  <Text style={styles.balanceText}>Balance Payment: ₹{receipt.balance}</Text>
                </View>
              </View>

              {/* Terms & Conditions - Two Columns in Landscape */}
              <View style={styles.termsSection}>
                <Text style={styles.termsHeader}>Terms & Conditions</Text>
                <View style={styles.termsColumns}>
                  <View style={styles.termsColumn}>
                    <Text style={styles.termsText}>1. GST will be Paid by Customer / Consignee</Text>
                    <Text style={styles.termsText}>2. GST exempted is given to H.O to BSCOCO TRANSPORT Company</Text>
                    <Text style={styles.termsText}>3. In case of Demurrage / Shortage Will not Liable by I/O Truckers EMS</Text>
                  </View>
                  <View style={styles.termsColumn}>
                    <Text style={styles.termsText}>4. After expiry of 3 months will not Liable by I/O Truckers EMS</Text>
                    <Text style={styles.termsText}>5. Any Type of Deduction Will be Not Accepted Without SMARTEMS Approval</Text>
                    <Text style={styles.termsText}>6. All claims Subject to City GHAZIABAD Jurisdiction</Text>
                  </View>
                </View>
              </View>

              {/* Signature */}
              <View style={styles.signatureSection}>
                <View style={styles.signaturePlaceholder}>
                  <Text style={styles.signatureText}>📱 SmART-EMS</Text>
                  <Text style={styles.signatureSubtext}>TRANSPORTKART</Text>
                  <Text style={styles.signatureSubtext}>Signing Authority</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => router.back()}
                  style={styles.backButton}
                  icon="arrow-left"
                >
                  Back to List
                </Button>
                <Button
                  mode="contained"
                  onPress={handleDownload}
                  loading={downloading}
                  disabled={downloading}
                  style={styles.downloadButton}
                  icon="download"
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  receiptCard: {
    backgroundColor: 'white',
    width: '95%',
    maxWidth: 800,
    minHeight: 600,
    elevation: 4,
    borderRadius: 8,
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  contactSection: {
    alignItems: 'flex-end',
  },
  contactHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  companyDetails: {
    alignItems: 'center',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  regText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#ddd',
  },
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  customerInfo: {
    flex: 1,
  },
  loadingInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },
  letterSection: {
    marginBottom: 12,
  },
  letterGreeting: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  letterBody: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'justify',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellText: {
    flex: 1,
    fontSize: 9,
    textAlign: 'center',
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  paymentSectionLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  paymentLeft: {
    flex: 1,
    marginRight: 20,
  },
  paymentRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  paymentHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  paymentText: {
    fontSize: 10,
    marginBottom: 2,
  },
  detentionText: {
    fontSize: 10,
    marginBottom: 2,
  },
  advanceText: {
    fontSize: 10,
    marginBottom: 2,
  },
  balanceText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  termsSection: {
    marginVertical: 12,
  },
  termsHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  termsColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  termsColumn: {
    flex: 1,
    marginRight: 16,
  },
  termsText: {
    fontSize: 9,
    marginBottom: 3,
    lineHeight: 12,
  },
  signatureSection: {
    alignItems: 'flex-end',
    marginVertical: 12,
  },
  signaturePlaceholder: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
  },
  signatureText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  signatureSubtext: {
    fontSize: 9,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#2e7d32',
  },
  downloadButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2e7d32',
  },
  landscapeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  cardContent: {
    padding: 16,
  },
}); 