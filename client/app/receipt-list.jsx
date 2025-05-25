import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Text,
  ActivityIndicator,
  Chip,
  IconButton,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { receiptsAPI } from '../src/utils/api';

export default function ReceiptListScreen() {
  const router = useRouter();
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchReceipts();
    }, [])
  );

  useEffect(() => {
    filterReceipts();
  }, [receipts, searchQuery]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await receiptsAPI.getAll();
      setReceipts(data.receipts || []);
    } catch (error) {
      console.error('Fetch receipts error:', error);
      Alert.alert('Error', 'Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  const filterReceipts = () => {
    if (!searchQuery.trim()) {
      setFilteredReceipts(receipts);
      return;
    }

    const filtered = receipts.filter(receipt => 
      receipt.loadingSlipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReceipts(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReceipts();
    setRefreshing(false);
  };

  const handleViewReceipt = (receiptId) => {
    router.push(`/receipt/${receiptId}`);
  };

  const handleDownloadReceipt = async (receiptId, loadingSlipNumber) => {
    try {
      await receiptsAPI.downloadPDF(receiptId);
      Alert.alert('Success', `PDF for ${loadingSlipNumber} downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download PDF');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderReceiptItem = ({ item }) => (
    <Card style={styles.receiptCard} key={item._id}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Title style={styles.slipNumber}>#{item.loadingSlipNumber}</Title>
            <Paragraph style={styles.customerName}>{item.customerName}</Paragraph>
          </View>
          <View style={styles.headerRight}>
            <Chip
              mode="outlined"
              textStyle={styles.chipText}
              style={styles.dateChip}
            >
              {formatDate(item.loadingDate)}
            </Chip>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>
            {item.fromCity} → {item.toCity}
          </Text>
          <Text style={styles.vehicleText}>
            Vehicle: {item.vehicleNumber}
          </Text>
        </View>

        <View style={styles.paymentInfo}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Freight:</Text>
            <Text style={styles.paymentValue}>₹{item.freight?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.balanceLabel}>Balance:</Text>
            <Text style={styles.balanceValue}>₹{item.balance?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => handleViewReceipt(item._id)}
            style={styles.viewButton}
            icon="eye"
            compact
          >
            View
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleDownloadReceipt(item._id, item.loadingSlipNumber)}
            style={styles.downloadButton}
            icon="download"
            compact
          >
            Download
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No receipts found matching your search' : 'No receipts found'}
      </Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Try a different search term' : 'Create your first loading slip to see it here'}
      </Text>
      {!searchQuery && (
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.createButton}
          icon="plus"
        >
          Create Loading Slip
        </Button>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading receipts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by slip number or customer name"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {filteredReceipts.length} Receipt{filteredReceipts.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </Text>
      </View>

      <FlatList
        data={filteredReceipts}
        renderItem={renderReceiptItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e7d32']}
            tintColor="#2e7d32"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8e9',
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  receiptCard: {
    marginBottom: 12,
    elevation: 3,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  slipNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dateChip: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  chipText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '600',
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vehicleText: {
    fontSize: 14,
    color: '#666',
  },
  paymentInfo: {
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  balanceValue: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#2e7d32',
  },
  downloadButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#2e7d32',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
  },
}); 