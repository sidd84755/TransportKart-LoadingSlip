import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import {
  Card,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Print from 'expo-print';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const generatePDFHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }
    
    body {
      background: white;
      padding: 10mm;
    }
    
    .loading-slip-header {
      background-color: #e0e0e0;
      padding: 12px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 15px;
      border: 1px solid #000000;
    }
    
    .company-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      border-bottom: 2px solid #000000;
      padding-bottom: 15px;
    }
    
    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
    }
    
    .logo-box {
      width: 50px;
      height: 50px;
      background-color: #4CAF50;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      color: white;
      font-size: 24px;
    }
    
    .logo-text {
      font-weight: bold;
      color: #4CAF50;
      font-size: 8px;
    }
    
    .company-details {
      flex: 1;
      text-align: center;
      padding: 0 15px;
    }
    
    .smart-ems {
      color: #d32f2f;
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 3px;
    }
    
    .company-name {
      color: #4CAF50;
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 5px;
    }
    
    .reg-office {
      font-size: 10px;
      margin-bottom: 3px;
    }
    
    .gst-pan {
      font-weight: bold;
      font-size: 10px;
    }
    
    .contact-info {
      width: 150px;
      text-align: left;
      font-size: 9px;
    }
    
    .contact-item {
      margin-bottom: 3px;
    }
    
    .customer-loading-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      border-bottom: 1px solid #000000;
      padding-bottom: 12px;
    }
    
    .customer-section, .loading-section {
      flex: 1;
    }
    
    .info-row {
      margin-bottom: 8px;
      font-size: 11px;
    }
    
    .info-label {
      font-weight: bold;
      margin-right: 8px;
    }
    
    .info-value {
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
      padding-left: 4px;
      padding-right: 4px;
    }
    
    .letter-content {
      margin: 12px 0;
      font-size: 11px;
      text-align: justify;
    }
    
    .letter-greeting {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .letter-body {
      margin-bottom: 4px;
    }
    
    .details-table {
      border: 2px solid #000000;
      margin-bottom: 15px;
      border-collapse: collapse;
      width: 100%;
    }
    
    .table-header th {
      background-color: #f0f0f0;
      border: 1px solid #000000;
      font-weight: bold;
      text-align: center;
      font-size: 10px;
      padding: 4px;
    }
    
    .table-row td {
      border: 1px solid #000000;
      text-align: center;
      font-size: 10px;
      padding: 4px;
    }
    
    .payment-section {
      display: flex;
      justify-content: space-between;
      margin: 15px 0;
      gap: 15px;
    }
    
    .payment-box {
      flex: 1;
      border: 2px solid #000000;
      padding: 12px;
    }
    
    .payment-header {
      font-weight: bold;
      text-align: center;
      margin-bottom: 8px;
      text-decoration: underline;
      font-size: 11px;
    }
    
    .payment-details {
      font-size: 10px;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    
    .balance-row {
      border-top: 1px solid #000000;
      padding-top: 4px;
      font-weight: bold;
    }
    
    .terms-section {
      margin: 15px 0;
    }
    
    .terms-header {
      font-weight: bold;
      text-decoration: underline;
      margin-bottom: 8px;
      font-size: 11px;
    }
    
    .terms-list {
      font-size: 9px;
      padding-left: 12px;
    }
    
    .terms-list li {
      margin-bottom: 2px;
    }
    
    .signature-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }
    
    .signature-box {
      border: 2px solid #000000;
      padding: 12px;
      text-align: center;
      width: 150px;
    }
    
    .signature-company {
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 3px;
    }
    
    .signature-name {
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 10px;
    }
    
    .signature-authority {
      font-size: 9px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <!-- Loading Slip Header -->
  <div class="loading-slip-header">Loading Slip</div>

  <!-- Company Header -->
  <div class="company-header">
    <!-- Logo -->
    <div class="logo-section">
      <div class="logo-box">🚛</div>
      <div class="logo-text">TRANSPORTKART</div>
    </div>

    <!-- Company Details -->
    <div class="company-details">
      <div class="smart-ems">SmART-EMS</div>
      <div class="company-name">TRANSPORTKART</div>
      <div class="reg-office">Reg. Office : H-48, Shriram Colony, Loni, Ghaziabad, Uttar Pradesh - 201102</div>
      <div class="gst-pan">GSTIN : 09DTIPK6278L1ZU     PAN No. DTIPK6278L</div>
    </div>

    <!-- Contact Info -->
    <div class="contact-info">
      <div class="contact-item">📧 connect@transportkart.com</div>
      <div class="contact-item">📞 +91-7827568785</div>
      <div class="contact-item">🌐 www.transportkart.com</div>
    </div>
  </div>

  <!-- Customer and Loading Info -->
  <div class="customer-loading-info">
    <div class="customer-section">
      <div class="info-row">
        <span class="info-label">Customer Name :</span>
        <span class="info-value">${receipt?.customerName || ''}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Address :</span>
        <span class="info-value">${receipt?.customerAddress || 'Haryana'}</span>
      </div>
    </div>
    <div class="loading-section">
      <div class="info-row">
        <span class="info-label">Loading Slip No. :</span>
        <span class="info-value">${receipt?.loadingSlipNo || ''}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Loading Date :</span>
        <span class="info-value">${formatDate(receipt?.loadingDate)}</span>
      </div>
    </div>
  </div>

  <!-- Letter Content -->
  <div class="letter-content">
    <div class="letter-greeting">Dear Sir / Madam,</div>
    <div class="letter-body">
      We are sending our truck based on our earlier discussion regarding the same. Requesting you please prepare load for the below truck on our behalf & oblige. Upcoming
    </div>
    <div>
      loading on Dated : <span style="text-decoration: underline; font-weight: bold;">${formatDate(receipt?.loadingDate)}</span> .
    </div>
  </div>

  <!-- Details Table -->
  <table class="details-table">
    <thead>
      <tr class="table-header">
        <th>Load Type</th>
        <th>From - To City</th>
        <th>Vehicle No.</th>
        <th>Driver No.</th>
        <th>Vehicle Type</th>
        <th>Material Wt</th>
        <th>Material</th>
        <th>Freight</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-row">
        <td>${receipt?.truckType || 'New'}</td>
        <td>${receipt?.fromCity} - ${receipt?.toCity}</td>
        <td>${receipt?.vehicleNo}</td>
        <td>${receipt?.driverNumber || '0000000000'}</td>
        <td>${receipt?.vehicleType || '22Ft open'}</td>
        <td>18 Ton</td>
        <td>${receipt?.material || 'Rods'}</td>
        <td>${formatCurrency(receipt?.freight)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Payment Section -->
  <div class="payment-section">
    <div class="payment-box">
      <div class="payment-header">Bank Information For Payment</div>
      <div class="payment-details">
        <div class="payment-row">
          <span>Payee Name</span>
          <span>SMART EMS</span>
        </div>
        <div class="payment-row">
          <span>Account Number</span>
          <span>459900210005230</span>
        </div>
        <div class="payment-row">
          <span>IFSC Code</span>
          <span>PUNB0455900</span>
        </div>
        <div class="payment-row">
          <span>QR ID</span>
          <span>transportkart@axl</span>
        </div>
      </div>
    </div>
    <div class="payment-box">
      <div class="payment-header">Payment Details</div>
      <div class="payment-details">
        <div class="payment-row">
          <span>Loading Detention</span>
          <span>${formatCurrency(receipt?.detention || 200)}</span>
        </div>
        <div class="payment-row">
          <span>Advance Payment</span>
          <span>${formatCurrency(receipt?.advance || 1000)}</span>
        </div>
        <div class="payment-row balance-row">
          <span>Balance Payment</span>
          <span>${formatCurrency(receipt?.balance)}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Terms & Conditions -->
  <div class="terms-section">
    <div class="terms-header">Terms & Conditions</div>
    <ol class="terms-list">
      <li>GST will be Paid By Consigner / Consignee</li>
      <li>GST exempted is given on hire to GOODS TRANSPORT Company</li>
      <li>Any Type Of Damage / Shortage Will Not Liability Of SmART-EMS</li>
      <li>If Material Will Theft Then No Any Deduction Will Be Accepted. Settle Loss With Insurance Company.</li>
      <li>Any Type Of Deduction Will Be Not Accepted Without SmART-EMS Approval</li>
      <li>All Dispute Subject To Our GHAZIABAD Jurisdiction</li>
    </ol>
  </div>

  <!-- Signature Section -->
  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-company">SmART-EMS</div>
      <div class="signature-name">TRANSPORTKART</div>
      <div class="signature-authority">Signing Authority</div>
    </div>
  </div>
</body>
</html>
    `;
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      
      const htmlContent = generatePDFHTML();
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Loading Slip - ${receipt.loadingSlipNo}`,
        });
      } else {
        Alert.alert('Success', 'PDF generated successfully!');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Receipt not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back and Download buttons */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loading Slip - {receipt.loadingSlipNo}</Text>
        <TouchableOpacity 
          onPress={handleDownloadPDF} 
          style={[styles.headerButton, styles.downloadButton]}
          disabled={downloading}
        >
          <Text style={styles.downloadButtonText}>
            {downloading ? 'Generating...' : '📄 PDF'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.receiptContainer}>
          <Card style={styles.receiptCard}>
            <Card.Content style={styles.cardContent}>
              {/* Loading Slip Header */}
              <View style={styles.loadingSlipHeader}>
                <Text style={styles.loadingSlipHeaderText}>Loading Slip</Text>
              </View>

              {/* Company Header */}
              <View style={styles.companyHeader}>
                {/* Logo */}
                <View style={styles.logoSection}>
                  <View style={styles.logoBox}>
                    <Text style={styles.logoIcon}>🚛</Text>
                  </View>
                  <Text style={styles.logoText}>TRANSPORTKART</Text>
                </View>

                {/* Company Details */}
                <View style={styles.companyDetails}>
                  <Text style={styles.smartEms}>SmART-EMS</Text>
                  <Text style={styles.companyName}>TRANSPORTKART</Text>
                  <Text style={styles.regOffice}>
                    Reg. Office : H-48, Shriram Colony, Loni, Ghaziabad, Uttar Pradesh - 201102
                  </Text>
                  <Text style={styles.gstPan}>
                    GSTIN : 09DTIPK6278L1ZU     PAN No. DTIPK6278L
                  </Text>
                </View>

                {/* Contact Info */}
                <View style={styles.contactInfo}>
                  <Text style={styles.contactText}>📧 connect@transportkart.com</Text>
                  <Text style={styles.contactText}>📞 +91-7827568785</Text>
                  <Text style={styles.contactText}>🌐 www.transportkart.com</Text>
                </View>
              </View>

              {/* Customer and Loading Info */}
              <View style={styles.customerLoadingInfo}>
                <View style={styles.customerSection}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Customer Name :</Text>
                    <Text style={styles.infoValue}> {receipt.customerName} </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address :</Text>
                    <Text style={styles.infoValue}> {receipt.customerAddress || 'Haryana'} </Text>
                  </View>
                </View>
                <View style={styles.loadingSection}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Loading Slip No. :</Text>
                    <Text style={styles.infoValue}> {receipt.loadingSlipNo} </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Loading Date :</Text>
                    <Text style={styles.infoValue}> {formatDate(receipt.loadingDate)} </Text>
                  </View>
                </View>
              </View>

              {/* Letter Content */}
              <View style={styles.letterContent}>
                <Text style={styles.letterGreeting}>Dear Sir / Madam,</Text>
                <Text style={styles.letterBody}>
                  We are sending our truck based on our earlier discussion regarding the same. Requesting you please prepare load for the below truck on our behalf & oblige. Upcoming
                </Text>
                <Text style={styles.letterBody}>
                  loading on Dated : <Text style={styles.underlineText}>{formatDate(receipt.loadingDate)}</Text> .
                </Text>
              </View>

              {/* Details Table */}
              <View style={styles.detailsTable}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>Load Type</Text>
                  <Text style={styles.tableHeaderCell}>From - To City</Text>
                  <Text style={styles.tableHeaderCell}>Vehicle No.</Text>
                  <Text style={styles.tableHeaderCell}>Driver No.</Text>
                  <Text style={styles.tableHeaderCell}>Vehicle Type</Text>
                  <Text style={styles.tableHeaderCell}>Material Wt</Text>
                  <Text style={styles.tableHeaderCell}>Material</Text>
                  <Text style={styles.tableHeaderCell}>Freight</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{receipt.truckType || 'New'}</Text>
                  <Text style={styles.tableCell}>{receipt.fromCity} - {receipt.toCity}</Text>
                  <Text style={styles.tableCell}>{receipt.vehicleNo}</Text>
                  <Text style={styles.tableCell}>{receipt.driverNumber || '0000000000'}</Text>
                  <Text style={styles.tableCell}>{receipt.vehicleType || '22Ft open'}</Text>
                  <Text style={styles.tableCell}>18 Ton</Text>
                  <Text style={styles.tableCell}>{receipt.material || 'Rods'}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(receipt.freight)}</Text>
                </View>
              </View>

              {/* Payment Section */}
              <View style={styles.paymentSection}>
                <View style={styles.paymentBox}>
                  <Text style={styles.paymentHeader}>Bank Information For Payment</Text>
                  <View style={styles.paymentDetails}>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Payee Name</Text>
                      <Text style={styles.paymentValue}>SMART EMS</Text>
                    </View>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Account Number</Text>
                      <Text style={styles.paymentValue}>459900210005230</Text>
                    </View>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>IFSC Code</Text>
                      <Text style={styles.paymentValue}>PUNB0455900</Text>
                    </View>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>QR ID</Text>
                      <Text style={styles.paymentValue}>transportkart@axl</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.paymentBox}>
                  <Text style={styles.paymentHeader}>Payment Details</Text>
                  <View style={styles.paymentDetails}>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Loading Detention</Text>
                      <Text style={styles.paymentValue}>{formatCurrency(receipt.detention || 200)}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Advance Payment</Text>
                      <Text style={styles.paymentValue}>{formatCurrency(receipt.advance || 1000)}</Text>
                    </View>
                    <View style={[styles.paymentRow, styles.balanceRow]}>
                      <Text style={styles.paymentLabelBold}>Balance Payment</Text>
                      <Text style={styles.paymentValueBold}>{formatCurrency(receipt.balance)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Terms & Conditions */}
              <View style={styles.termsSection}>
                <Text style={styles.termsHeader}>Terms & Conditions</Text>
                <View style={styles.termsList}>
                  <Text style={styles.termsText}>1. GST will be Paid By Consigner / Consignee</Text>
                  <Text style={styles.termsText}>2. GST exempted is given on hire to GOODS TRANSPORT Company</Text>
                  <Text style={styles.termsText}>3. Any Type Of Damage / Shortage Will Not Liability Of SmART-EMS</Text>
                  <Text style={styles.termsText}>4. If Material Will Theft Then No Any Deduction Will Be Accepted. Settle Loss With Insurance Company.</Text>
                  <Text style={styles.termsText}>5. Any Type Of Deduction Will Be Not Accepted Without SmART-EMS Approval</Text>
                  <Text style={styles.termsText}>6. All Dispute Subject To Our GHAZIABAD Jurisdiction</Text>
                </View>
              </View>

              {/* Signature Section */}
              <View style={styles.signatureSection}>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureCompany}>SmART-EMS</Text>
                  <Text style={styles.signatureName}>TRANSPORTKART</Text>
                  <Text style={styles.signatureAuthority}>Signing Authority</Text>
                </View>
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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
    color: '#4CAF50',
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
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 8,
  },
  receiptContainer: {
    alignItems: 'center',
  },
  receiptCard: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 800,
    elevation: 4,
    borderRadius: 8,
    marginVertical: 8,
  },
  cardContent: {
    padding: 16,
  },
  loadingSlipHeader: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000000',
  },
  loadingSlipHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 15,
  },
  logoSection: {
    alignItems: 'center',
    width: 80,
  },
  logoBox: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoIcon: {
    fontSize: 24,
    color: 'white',
  },
  logoText: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 8,
  },
  companyDetails: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  smartEms: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 3,
  },
  companyName: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 5,
  },
  regOffice: {
    fontSize: 10,
    marginBottom: 3,
    textAlign: 'center',
  },
  gstPan: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  contactInfo: {
    width: 150,
    alignItems: 'flex-start',
  },
  contactText: {
    fontSize: 9,
    marginBottom: 3,
  },
  customerLoadingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 12,
  },
  customerSection: {
    flex: 1,
  },
  loadingSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 11,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    paddingHorizontal: 4,
  },
  letterContent: {
    marginVertical: 12,
  },
  letterGreeting: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 4,
  },
  letterBody: {
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'justify',
  },
  underlineText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  detailsTable: {
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    gap: 15,
  },
  paymentBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 12,
  },
  paymentHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textDecorationLine: 'underline',
    fontSize: 11,
  },
  paymentDetails: {
    // Container for payment details
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 10,
  },
  paymentValue: {
    fontSize: 10,
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 4,
  },
  paymentLabelBold: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  paymentValueBold: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  termsSection: {
    marginVertical: 15,
  },
  termsHeader: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 8,
    fontSize: 11,
  },
  termsList: {
    paddingLeft: 12,
  },
  termsText: {
    fontSize: 9,
    marginBottom: 2,
  },
  signatureSection: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  signatureBox: {
    borderWidth: 2,
    borderColor: '#000000',
    padding: 12,
    alignItems: 'center',
    width: 150,
  },
  signatureCompany: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 3,
  },
  signatureName: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 10,
  },
  signatureAuthority: {
    fontSize: 9,
    fontWeight: 'bold',
  },
}); 