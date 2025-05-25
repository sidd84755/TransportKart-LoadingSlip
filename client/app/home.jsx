import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Divider,
  Menu,
  IconButton,
  Text,
  Appbar,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import { receiptsAPI, authAPI } from '../src/utils/api';

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatingSlipNumber, setGeneratingSlipNumber] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    loadingSlipNumber: '',
    loadingDate: new Date(),
    customerName: '',
    customerAddress: '',
    fromCity: '',
    toCity: '',
    truckType: '',
    vehicleNumber: '',
    driverNumber: '',
    vehicleType: '',
    material: '',
    ownership: '',
    freight: '',
    detention: '',
    advance: '',
    balance: '',
    remarks: '',
  });

  // Auto-generate loading slip number when component loads
  useEffect(() => {
    generateLoadingSlipNumber();
  }, []);

  const generateLoadingSlipNumber = async () => {
    setGeneratingSlipNumber(true);
    try {
      const response = await receiptsAPI.getNextSlipNumber();
      setFormData(prev => ({
        ...prev,
        loadingSlipNumber: response.loadingSlipNumber
      }));
    } catch (error) {
      console.error('Generate slip number error:', error);
      Alert.alert('Error', 'Failed to generate loading slip number');
    } finally {
      setGeneratingSlipNumber(false);
    }
  };

  const vehicleTypes = [
    { label: 'Truck', value: 'Truck' },
    { label: 'Trailer', value: 'Trailer' },
    { label: 'Container', value: 'Container' },
    { label: 'Tanker', value: 'Tanker' },
    { label: 'Flatbed', value: 'Flatbed' },
    { label: 'Refrigerated', value: 'Refrigerated' },
  ];

  const ownershipTypes = [
    { label: 'TransportKART', value: 'TransportKART' },
    { label: 'State Logistics', value: 'State Logistics' },
    { label: 'Private', value: 'Private' },
    { label: 'Leased', value: 'Leased' },
  ];

  const updateFormField = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-calculate balance when freight, detention, or advance changes
    if (['freight', 'detention', 'advance'].includes(field)) {
      const freight = parseFloat(newFormData.freight) || 0;
      const detention = parseFloat(newFormData.detention) || 0;
      const advance = parseFloat(newFormData.advance) || 0;
      newFormData.balance = (freight + detention - advance).toFixed(2);
    }
    
    setFormData(newFormData);
  };

  const validateForm = () => {
    const required = ['loadingSlipNumber', 'customerName', 'fromCity', 'toCity', 'vehicleNumber'];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      Alert.alert('Validation Error', `Please fill in: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const receiptData = {
        ...formData,
        loadingDate: formData.loadingDate.toISOString(),
        freight: parseFloat(formData.freight) || 0,
        detention: parseFloat(formData.detention) || 0,
        advance: parseFloat(formData.advance) || 0,
        balance: parseFloat(formData.balance) || 0,
      };

      await receiptsAPI.create(receiptData);
      Alert.alert('Success', 'Loading slip saved successfully!');
      
      // Reset form and generate new slip number
      setFormData({
        loadingSlipNumber: '', // Will be updated by generateLoadingSlipNumber
        loadingDate: new Date(),
        customerName: '',
        customerAddress: '',
        fromCity: '',
        toCity: '',
        truckType: '',
        vehicleNumber: '',
        driverNumber: '',
        vehicleType: '',
        material: '',
        ownership: '',
        freight: '',
        detention: '',
        advance: '',
        balance: '',
        remarks: '',
      });
      
      // Generate new loading slip number for next entry
      await generateLoadingSlipNumber();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save loading slip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!validateForm()) return;

    setDownloading(true);
    try {
      const receiptData = {
        ...formData,
        loadingDate: formData.loadingDate.toISOString(),
        freight: parseFloat(formData.freight) || 0,
        detention: parseFloat(formData.detention) || 0,
        advance: parseFloat(formData.advance) || 0,
        balance: parseFloat(formData.balance) || 0,
      };

      // First create the receipt
      const response = await receiptsAPI.create(receiptData);
      
      // Then download the PDF
      await receiptsAPI.downloadPDF(response.receipt._id);
      
      Alert.alert('Success', 'PDF generated and downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateFormField('loadingDate', selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Loading Slip Form" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/receipt-list');
            }}
            title="View Receipts"
            leadingIcon="list"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleLogout();
            }}
            title="Logout"
            leadingIcon="logout"
          />
        </Menu>
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Loading Slip Number *"
              value={generatingSlipNumber ? 'Generating...' : formData.loadingSlipNumber}
              onChangeText={(value) => updateFormField('loadingSlipNumber', value)}
              mode="outlined"
              style={[styles.input, styles.readOnlyInput]}
              editable={false}
              right={generatingSlipNumber ? <TextInput.Icon icon="loading" /> : null}
            />

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Loading Date *</Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                {formData.loadingDate.toLocaleDateString()}
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={formData.loadingDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <TextInput
              label="Customer Name *"
              value={formData.customerName}
              onChangeText={(value) => updateFormField('customerName', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Customer Address"
              value={formData.customerAddress}
              onChangeText={(value) => updateFormField('customerAddress', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                label="From City *"
                value={formData.fromCity}
                onChangeText={(value) => updateFormField('fromCity', value)}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
              />
              <TextInput
                label="To City *"
                value={formData.toCity}
                onChangeText={(value) => updateFormField('toCity', value)}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <TextInput
              label="Truck Type"
              value={formData.truckType}
              onChangeText={(value) => updateFormField('truckType', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Vehicle Number *"
              value={formData.vehicleNumber}
              onChangeText={(value) => updateFormField('vehicleNumber', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Driver Number"
              value={formData.driverNumber}
              onChangeText={(value) => updateFormField('driverNumber', value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Vehicle Type</Text>
              <RNPickerSelect
                placeholder={{ label: 'Select Vehicle Type', value: null }}
                items={vehicleTypes}
                onValueChange={(value) => updateFormField('vehicleType', value)}
                value={formData.vehicleType}
                style={pickerSelectStyles}
              />
            </View>

            <TextInput
              label="Material"
              value={formData.material}
              onChangeText={(value) => updateFormField('material', value)}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Ownership</Text>
              <RNPickerSelect
                placeholder={{ label: 'Select Ownership', value: null }}
                items={ownershipTypes}
                onValueChange={(value) => updateFormField('ownership', value)}
                value={formData.ownership}
                style={pickerSelectStyles}
              />
            </View>

            <Divider style={styles.divider} />
            <Title style={styles.sectionTitle}>Payment Details</Title>

            <View style={styles.row}>
              <TextInput
                label="Freight (₹)"
                value={formData.freight}
                onChangeText={(value) => updateFormField('freight', value)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />
              <TextInput
                label="Detention (₹)"
                value={formData.detention}
                onChangeText={(value) => updateFormField('detention', value)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                label="Advance (₹)"
                value={formData.advance}
                onChangeText={(value) => updateFormField('advance', value)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />
              <TextInput
                label="Balance (₹)"
                value={formData.balance}
                mode="outlined"
                editable={false}
                style={[styles.input, styles.halfWidth, styles.disabledInput]}
              />
            </View>

            <TextInput
              label="Remarks"
              value={formData.remarks}
              onChangeText={(value) => updateFormField('remarks', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <Divider style={styles.divider} />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={loading}
                disabled={loading || downloading}
                style={[styles.button, styles.saveButton]}
                labelStyle={styles.buttonLabel}
              >
                Save
              </Button>
              
              <Button
                mode="contained"
                onPress={handleDownload}
                loading={downloading}
                disabled={loading || downloading}
                style={[styles.button, styles.downloadButton]}
                labelStyle={styles.buttonLabel}
              >
                Download
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => router.push('/receipt-list')}
                disabled={loading || downloading}
                style={[styles.button, styles.listButton]}
                labelStyle={styles.outlineButtonLabel}
              >
                List
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8e9',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#e0e0e0',
  },
  input: {
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
  readOnlyInput: {
    backgroundColor: '#f0f7f0',
    borderColor: '#2e7d32',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
  },
  downloadButton: {
    backgroundColor: '#4caf50',
  },
  listButton: {
    borderColor: '#2e7d32',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonLabel: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: '600',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
}); 