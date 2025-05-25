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
    loadingSlipNo: '',
    loadingDate: new Date(),
    customerName: '',
    customerAddress: '',
    fromCity: '',
    toCity: '',
    truckType: '',
    vehicleNo: '',
    driverNumber: '',
    vehicleType: '',
    material: '',
    ownership: 'TransportKART',
    freight: '',
    detention: '',
    advance: '',
    balance: '',
    remark: '',
  });

  // Auto-generate loading slip number when component loads
  useEffect(() => {
    generateLoadingSlipNumber();
  }, []);

  const generateLoadingSlipNumber = async () => {
    setGeneratingSlipNumber(true);
    try {
      const response = await receiptsAPI.getNextSlipNumber();
      console.log('Generated slip number:', response.loadingSlipNumber);
      setFormData(prev => ({
        ...prev,
        loadingSlipNo: response.loadingSlipNumber
      }));
    } catch (error) {
      console.error('Generate slip number error:', error);
      Alert.alert('Error', 'Failed to generate loading slip number');
    } finally {
      setGeneratingSlipNumber(false);
    }
  };

  const vehicleTypes = [
    { label: '14Ft open', value: '14Ft open' },
    { label: '14Ft container', value: '14Ft container' },
    { label: '17Ft open', value: '17Ft open' },
    { label: '17Ft container', value: '17Ft container' },
    { label: '19Ft open', value: '19Ft open' },
    { label: '19Ft container', value: '19Ft container' },
    { label: '20Ft open', value: '20Ft open' },
    { label: '20Ft container', value: '20Ft container' },
    { label: '22Ft open', value: '22Ft open' },
    { label: '22Ft container', value: '22Ft container' },
    { label: '24Ft open', value: '24Ft open' },
    { label: '24Ft container', value: '24Ft container' },
    { label: '32Ft XL', value: '32Ft XL' },
    { label: '32Ft XXL', value: '32Ft XXL' },
    { label: '32Ft XXXL', value: '32Ft XXXL' },
    { label: '40Ft container', value: '40Ft container' },
    { label: '10 tyre open truck', value: '10 tyre open truck' },
    { label: '12 tyre open truck', value: '12 tyre open truck' },
    { label: '14 tyre open truck', value: '14 tyre open truck' },
    { label: '16 tyre open truck', value: '16 tyre open truck' },
    { label: '18 tyre open truck', value: '18 tyre open truck' },
    { label: '20 tyre open truck', value: '20 tyre open truck' },
    { label: '22 tyre open truck', value: '22 tyre open truck' },
    { label: '24 tyre open truck', value: '24 tyre open truck' },
    { label: '40Ft trailer lower bed', value: '40Ft trailer lower bed' },
    { label: '40Ft trailer higher bed', value: '40Ft trailer higher bed' },
    { label: '40Ft trailer semi high bed', value: '40Ft trailer semi high bed' },
  ];

  const ownershipTypes = [
    { label: 'TransportKART', value: 'TransportKART' },
    { label: 'State Logistics', value: 'State Logistics' },
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
    const required = [
      'loadingSlipNo', 'customerName', 'customerAddress', 'fromCity', 'toCity', 
      'truckType', 'vehicleNo', 'driverNumber', 'freight', 'vehicleType', 
      'material', 'ownership'
    ];
    
    const missing = [];
    
    // Check string fields
    const stringFields = ['loadingSlipNo', 'customerName', 'customerAddress', 'fromCity', 'toCity', 'truckType', 'vehicleNo', 'driverNumber', 'vehicleType', 'material', 'ownership'];
    stringFields.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        missing.push(field);
      }
    });
    
    // Check numeric fields
    if (!formData.freight || parseFloat(formData.freight) < 0) {
      missing.push('freight');
    }
    
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
        loadingSlipNo: '', // Will be updated by generateLoadingSlipNumber
        loadingDate: new Date(),
        customerName: '',
        customerAddress: '',
        fromCity: '',
        toCity: '',
        truckType: '',
        vehicleNo: '',
        driverNumber: '',
        vehicleType: '',
        material: '',
        ownership: 'TransportKART',
        freight: '',
        detention: '',
        advance: '',
        balance: '',
        remark: '',
      });
      
      // Generate new loading slip number for next entry
      await generateLoadingSlipNumber();
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to save loading slip. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Error', errorMessage);
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
              label="Loading Slip Number*"
              value={generatingSlipNumber ? 'Generating...' : formData.loadingSlipNo}
              onChangeText={(value) => updateFormField('loadingSlipNo', value)}
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
              label="Customer Address *"
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
              label="Truck Type *"
              value={formData.truckType}
              onChangeText={(value) => updateFormField('truckType', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Vehicle Number *"
              value={formData.vehicleNo}
              onChangeText={(value) => updateFormField('vehicleNo', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Driver Number *"
              value={formData.driverNumber}
              onChangeText={(value) => updateFormField('driverNumber', value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Vehicle Type *</Text>
              <RNPickerSelect
                placeholder={{ label: 'Select Vehicle Type', value: null }}
                items={vehicleTypes}
                onValueChange={(value) => updateFormField('vehicleType', value)}
                value={formData.vehicleType}
                style={pickerSelectStyles}
                doneText="Done"
                onDonePress={() => {
                  // Optional: Add any logic when done is pressed
                  console.log('Vehicle type picker closed');
                }}
              />
            </View>

            <TextInput
              label="Material *"
              value={formData.material}
              onChangeText={(value) => updateFormField('material', value)}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Ownership *</Text>
              <RNPickerSelect
                placeholder={{ label: 'Select Ownership', value: null }}
                items={ownershipTypes}
                onValueChange={(value) => updateFormField('ownership', value)}
                value={formData.ownership}
                style={pickerSelectStyles}
                doneText="Done"
                onDonePress={() => {
                  // Optional: Add any logic when done is pressed
                  console.log('Ownership picker closed');
                }}
              />
            </View>

            <Divider style={styles.divider} />
            <Title style={styles.sectionTitle}>Payment Details</Title>

            <View style={styles.row}>
              <TextInput
                label="Freight (₹) *"
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
              value={formData.remark}
              onChangeText={(value) => updateFormField('remark', value)}
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