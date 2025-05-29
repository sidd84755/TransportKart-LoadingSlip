import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import {
  Visibility,
  Download,
  Logout,
  LocalShipping,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { receiptAPI } from '../services/api';

const CustomToolbar = ({ onRefresh, loading }) => {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between', p: 1 }}>
      <Box>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
      <Button
        startIcon={<Refresh />}
        onClick={onRefresh}
        disabled={loading}
        size="small"
      >
        Refresh
      </Button>
    </GridToolbarContainer>
  );
};

const HomePage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await receiptAPI.getAll();
      setReceipts(response.data || []);
    } catch (err) {
      console.error('Error fetching receipts:', err);
      setError('Failed to load receipts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (id) => {
    navigate(`/receipt/${id}`);
  };

  const handleDownloadPDF = async (id, loadingSlipNo) => {
    try {
      const response = await receiptAPI.downloadPDF(id);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LoadingSlip_${loadingSlipNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const columns = [
    {
      field: 'loadingSlipNo',
      headerName: 'Loading Slip No.',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color="primary" 
          size="small" 
          variant="outlined"
        />
      )
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'fromCity',
      headerName: 'From',
      width: 120,
    },
    {
      field: 'toCity',
      headerName: 'To',
      width: 120,
    },
    {
      field: 'vehicleNo',
      headerName: 'Vehicle No.',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontFamily="monospace">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'vehicleType',
      headerName: 'Vehicle Type',
      width: 130,
    },
    {
      field: 'material',
      headerName: 'Material',
      width: 150,
    },
    {
      field: 'freight',
      headerName: 'Freight',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium" color="success.main">
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'loadingDate',
      headerName: 'Loading Date',
      width: 130,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 130,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="View Receipt">
              <Visibility />
            </Tooltip>
          }
          label="View"
          onClick={() => handleViewReceipt(params.id)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Download PDF">
              <Download />
            </Tooltip>
          }
          label="Download"
          onClick={() => handleDownloadPDF(params.id, params.row.loadingSlipNo)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <LocalShipping sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TransportKart - Loading Slip Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Welcome, {user?.username || 'Admin'}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Loading Slips
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and view all your loading slips
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={receipts}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              disableSelectionOnClick
              loading={loading}
              slots={{
                toolbar: (props) => <CustomToolbar {...props} onRefresh={fetchReceipts} loading={loading} />
              }}
              sx={{
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'createdAt', sort: 'desc' }],
                },
              }}
            />
          </Box>

          {receipts.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No receipts found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Loading slips will appear here once they are created.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage; 