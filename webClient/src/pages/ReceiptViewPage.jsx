import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid
} from '@mui/material';
import {
  ArrowBack,
  Download,
  LocalShipping,
  Email,
  Phone,
  Web
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { receiptAPI } from '../services/api';
import html2pdf from 'html2pdf.js';

const ReceiptViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await receiptAPI.getById(id);
      setReceipt(response.data);
    } catch (err) {
      console.error('Error fetching receipt:', err);
      setError('Failed to load receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      
      const element = document.getElementById('receipt-content');
      const options = {
        margin: [10, 10, 10, 10],
        filename: `LoadingSlip_${receipt.loadingSlipNo}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1} className="no-print">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
          <LocalShipping sx={{ ml: 2, mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Loading Slip - {receipt?.loadingSlipNo}
          </Typography>
          <Button
            color="inherit"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Receipt Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper 
          id="receipt-content"
          elevation={3} 
          sx={{ 
            p: 4,
            backgroundColor: '#ffffff',
            '& *': {
              fontFamily: 'Arial, sans-serif !important'
            }
          }}
        >
          {/* Loading Slip Header */}
          <Box sx={{ 
            backgroundColor: '#e0e0e0', 
            p: 1.5, 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: '16px',
            mb: 2,
            border: '1px solid #000000'
          }}>
            Loading Slip
          </Box>

          {/* Company Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2,
            borderBottom: '2px solid #000000',
            pb: 2
          }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
                backgroundColor: '#4CAF50', 
                borderRadius: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 0.5
              }}>
                <LocalShipping sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4CAF50', fontSize: '8px' }}>
                TRANSPORTKART
              </Typography>
            </Box>

            {/* Company Details */}
            <Box sx={{ flex: 1, textAlign: 'center', px: 2 }}>
              <Typography sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '12px', mb: 0.3 }}>
                SmART-EMS
              </Typography>
              <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 0.5, fontSize: '24px' }}>
                TRANSPORTKART
              </Typography>
              <Typography sx={{ fontSize: '10px', mb: 0.3 }}>
                Reg. Office : H-48, Shriram Colony, Loni, Ghaziabad, Uttar Pradesh - 201102
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>
                GSTIN : 09DTIPK6278L1ZU &nbsp;&nbsp;&nbsp;&nbsp; PAN No. DTIPK6278L
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ width: '150px', textAlign: 'left', fontSize: '9px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                <Email sx={{ fontSize: 10, mr: 0.5 }} />
                <Typography sx={{ fontSize: '9px' }}>connect@transportkart.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                <Phone sx={{ fontSize: 10, mr: 0.5 }} />
                <Typography sx={{ fontSize: '9px' }}>+91-7827568785</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Web sx={{ fontSize: 10, mr: 0.5 }} />
                <Typography sx={{ fontSize: '9px' }}>www.transportkart.com</Typography>
              </Box>
            </Box>
          </Box>

          {/* Customer and Loading Info */}
          <Grid container spacing={2} sx={{ mb: 2, borderBottom: '1px solid #000000', pb: 1.5 }}>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '11px', mr: 1 }}>Customer Name :</Typography>
                <Typography component="span" sx={{ borderBottom: '1px solid #000000', pb: 0.2, fontSize: '11px' }}>
                  &nbsp;{receipt?.customerName}&nbsp;
                </Typography>
              </Box>
              <Box>
                <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '11px', mr: 1 }}>Address :</Typography>
                <Typography component="span" sx={{ borderBottom: '1px solid #000000', pb: 0.2, fontSize: '11px' }}>
                  &nbsp;{receipt?.customerAddress || 'Haryana'}&nbsp;
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '11px', mr: 1 }}>Loading Slip No. :</Typography>
                <Typography component="span" sx={{ borderBottom: '1px solid #000000', pb: 0.2, fontSize: '11px' }}>
                  &nbsp;{receipt?.loadingSlipNo}&nbsp;
                </Typography>
              </Box>
              <Box>
                <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '11px', mr: 1 }}>Loading Date :</Typography>
                <Typography component="span" sx={{ borderBottom: '1px solid #000000', pb: 0.2, fontSize: '11px' }}>
                  &nbsp;{formatDate(receipt?.loadingDate)}&nbsp;
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Letter Content */}
          <Box sx={{ my: 1.5, fontSize: '11px', textAlign: 'justify' }}>
            <Typography sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '11px' }}>Dear Sir / Madam,</Typography>
            <Typography sx={{ mb: 0.5, fontSize: '11px' }}>
              We are sending our truck based on our earlier discussion regarding the same. Requesting you please prepare load for the below truck on our behalf & oblige. Upcoming
            </Typography>
            <Typography sx={{ fontSize: '11px' }}>
              loading on Dated : <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                {formatDate(receipt?.loadingDate)}
              </span> .
            </Typography>
          </Box>

          {/* Details Table */}
          <TableContainer sx={{ border: '2px solid #000000', mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    Load Type
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    From - To City
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    Vehicle No.
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    Driver No.
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    Vehicle Type
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    Material Wt
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    Material
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', fontWeight: 'bold', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    Freight
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    {receipt?.truckType || 'New'}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    {receipt?.fromCity} - {receipt?.toCity}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    {receipt?.vehicleNo}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    {receipt?.driverNumber || '0000000000'}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    {receipt?.vehicleType || '22Ft open'}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    18 Ton
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    {receipt?.material || 'Rods'}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000000', textAlign: 'center', fontSize: '10px', p: 0.5 }}>
                    {formatCurrency(receipt?.freight)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Payment Section */}
          <Grid container spacing={2} sx={{ my: 2 }} flex={1} flexDirection="row" justifyContent="space-between">
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 1.5, border: '2px solid #000000' }}>
                <Typography sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1, textDecoration: 'underline', fontSize: '11px' }}>
                  Bank Information For Payment
                </Typography>
                <Box sx={{ fontSize: '10px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>Payee Name</Typography>
                    <Typography sx={{ fontSize: '10px' }}>SMART EMS</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>Account Number</Typography>
                    <Typography sx={{ fontSize: '10px' }}>459900210005230</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>IFSC Code</Typography>
                    <Typography sx={{ fontSize: '10px' }}>PUNB0455900</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>QR ID</Typography>
                    <Typography sx={{ fontSize: '10px' }}>transportkart@axl</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 1.5, border: '2px solid #000000' }}>
                <Typography sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1, textDecoration: 'underline', fontSize: '11px' }}>
                  Payment Details
                </Typography>
                <Box sx={{ fontSize: '10px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '10px' }}>Loading Detention</Typography>
                    <Typography sx={{ fontSize: '10px' }}>{formatCurrency(receipt?.detention || 200)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '10px' }}>Advance Payment</Typography>
                    <Typography sx={{ fontSize: '10px' }}>{formatCurrency(receipt?.advance || 1000)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5, borderTop: '1px solid #000000' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>Balance Payment</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '10px' }}>{formatCurrency(receipt?.balance)}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Terms & Conditions */}
          <Box sx={{ my: 2 }}>
            <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline', mb: 1, fontSize: '11px' }}>
              Terms & Conditions
            </Typography>
            <Box component="ol" sx={{ pl: 1.5, fontSize: '9px', '& li': { mb: 0.2 } }}>
              <Typography component="li" sx={{ fontSize: '9px' }}>GST will be Paid By Consigner / Consignee</Typography>
              <Typography component="li" sx={{ fontSize: '9px' }}>GST exempted is given on hire to GOODS TRANSPORT Company</Typography>
              <Typography component="li" sx={{ fontSize: '9px' }}>Any Type Of Damage / Shortage Will Not Liability Of SmART-EMS</Typography>
              <Typography component="li" sx={{ fontSize: '9px' }}>If Material Will Theft Then No Any Deduction Will Be Accepted. Settle Loss With Insurance Company.</Typography>
              <Typography component="li" sx={{ fontSize: '9px' }}>Any Type Of Deduction Will Be Not Accepted Without SmART-EMS Approval</Typography>
              <Typography component="li" sx={{ fontSize: '9px' }}>All Dispute Subject To Our GHAZIABAD Jurisdiction</Typography>
            </Box>
          </Box>

          {/* Signature Section */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', border: '2px solid #000000', width: '150px' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '10px', mb: 0.3 }}>SmART-EMS</Typography>
              <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: '10px' }}>TRANSPORTKART</Typography>
              <Typography sx={{ fontSize: '9px', fontWeight: 'bold' }}>Signing Authority</Typography>
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReceiptViewPage; 