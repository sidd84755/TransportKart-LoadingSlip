const pdf = require('html-pdf');
const moment = require('moment');

const generateReceiptHTML = (receipt) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {
                size: A4;
                margin: 0.5in;
            }
            
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #000;
                font-size: 12px;
                line-height: 1.2;
            }
            
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
                border-bottom: 2px solid #000;
                padding-bottom: 15px;
            }
            
            .logo-section {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .logo {
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #4CAF50, #2E7D32);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
            }
            
            .company-info {
                text-align: center;
                flex: 1;
                margin: 0 20px;
            }
            
            .company-header {
                color: #D32F2F;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 2px;
            }
            
            .company-name {
                font-size: 24px;
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 8px;
            }
            
            .company-address {
                font-size: 10px;
                color: #666;
                margin-bottom: 4px;
            }
            
            .company-reg {
                font-size: 10px;
                font-weight: bold;
                color: #333;
            }
            
            .contact-section {
                text-align: right;
                font-size: 11px;
                color: #666;
                line-height: 1.3;
            }
            
            .contact-item {
                margin-bottom: 2px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 5px;
            }
            
            .customer-loading-section {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
                border-bottom: 1px solid #ddd;
                padding-bottom: 15px;
            }
            
            .customer-info, .loading-info {
                width: 48%;
            }
            
            .info-row {
                margin-bottom: 8px;
                font-size: 12px;
            }
            
            .label {
                font-weight: bold;
                display: inline-block;
                width: 120px;
                color: #333;
            }
            
            .value {
                color: #000;
            }
            
            .letter-section {
                margin: 20px 0;
                font-size: 12px;
                line-height: 1.4;
            }
            
            .greeting {
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .letter-body {
                text-align: justify;
                margin-bottom: 10px;
            }
            
            .loading-date-highlight {
                font-weight: bold;
                text-decoration: underline;
            }
            
            .details-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                border: 2px solid #000;
            }
            
            .details-table th {
                background-color: #f0f0f0;
                border: 1px solid #000;
                padding: 8px 4px;
                text-align: center;
                font-size: 10px;
                font-weight: bold;
                vertical-align: middle;
            }
            
            .details-table td {
                border: 1px solid #000;
                padding: 8px 4px;
                text-align: center;
                font-size: 10px;
                vertical-align: middle;
            }
            
            .payment-section {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
                gap: 30px;
            }
            
            .bank-info, .payment-details {
                flex: 1;
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 5px;
            }
            
            .section-title {
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 10px;
                text-decoration: underline;
            }
            
            .bank-row, .payment-row {
                margin-bottom: 5px;
                font-size: 11px;
                display: flex;
                justify-content: space-between;
            }
            
            .payment-row.balance {
                font-weight: bold;
                border-top: 1px solid #333;
                padding-top: 5px;
                margin-top: 8px;
            }
            
            .terms-section {
                margin: 20px 0;
            }
            
            .terms-title {
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 10px;
                text-decoration: underline;
            }
            
            .terms-columns {
                display: flex;
                gap: 20px;
            }
            
            .terms-column {
                flex: 1;
            }
            
            .terms-item {
                font-size: 10px;
                margin-bottom: 5px;
                line-height: 1.3;
            }
            
            .signature-section {
                margin-top: 30px;
                text-align: right;
            }
            
            .signature-box {
                display: inline-block;
                border: 1px solid #333;
                padding: 20px;
                text-align: center;
                border-radius: 5px;
                min-width: 150px;
            }
            
            .signature-logo {
                font-size: 16px;
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 5px;
            }
            
            .signature-company {
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            .signature-authority {
                font-size: 10px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <!-- Header Section -->
        <div class="header">
            <div class="logo-section">
                <div class="logo">🚛</div>
                <div style="font-size: 10px; font-weight: bold; color: #2E7D32;">TRANSPORTKART</div>
            </div>
            
            <div class="company-info">
                <div class="company-header">SmART-EMS</div>
                <div class="company-name">TRANSPORTKART</div>
                <div class="company-address">
                    Reg. Office: H-48, Shram Colony, Loni, Ghaziabad, Uttar Pradesh - 201102
                </div>
                <div class="company-reg">
                    GSTIN: 09DTIPK6278L1ZU | PAN No: DTIPK6278L
                </div>
            </div>
            
            <div class="contact-section">
                <div class="contact-item">📧 connect@transportkart.com</div>
                <div class="contact-item">📞 +91-7827568785</div>
                <div class="contact-item">🌐 www.transportkart.com</div>
            </div>
        </div>

        <!-- Customer and Loading Information -->
        <div class="customer-loading-section">
            <div class="customer-info">
                <div class="info-row">
                    <span class="label">Customer Name:</span>
                    <span class="value">${receipt.customerName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Address:</span>
                    <span class="value">${receipt.customerAddress}</span>
                </div>
            </div>
            
            <div class="loading-info">
                <div class="info-row">
                    <span class="label">Loading Slip No.:</span>
                    <span class="value">${receipt.loadingSlipNo}</span>
                </div>
                <div class="info-row">
                    <span class="label">Loading Date:</span>
                    <span class="value">${moment(receipt.loadingDate).format('DD-MM-YYYY')}</span>
                </div>
            </div>
        </div>

        <!-- Formal Letter -->
        <div class="letter-section">
            <div class="greeting">Dear Sir / Madam,</div>
            <div class="letter-body">
                We are sending our truck based on our earlier discussion regarding the same. Requesting you please prepare load for the below truck on our behalf & oblige. Upcoming
            </div>
            <div class="letter-body">
                loading on Dated: <span class="loading-date-highlight">${moment(receipt.loadingDate).format('DD-MM-YYYY')}</span>.
            </div>
        </div>

        <!-- Details Table -->
        <table class="details-table">
            <thead>
                <tr>
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
                <tr>
                    <td>${receipt.truckType || 'Full Load'}</td>
                    <td>${receipt.fromCity} - ${receipt.toCity}</td>
                    <td>${receipt.vehicleNo}</td>
                    <td>${receipt.driverNumber}</td>
                    <td>${receipt.vehicleType}</td>
                    <td>-</td>
                    <td>${receipt.material}</td>
                    <td>${parseFloat(receipt.freight).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>

        <!-- Payment Section -->
        <div class="payment-section">
            <div class="bank-info">
                <div class="section-title">Bank Information For Payment</div>
                <div class="bank-row">
                    <span><strong>Payee Name</strong></span>
                    <span>SMART EMS</span>
                </div>
                <div class="bank-row">
                    <span><strong>Account Number</strong></span>
                    <span>459900510005224</span>
                </div>
                <div class="bank-row">
                    <span><strong>IFSC Code</strong></span>
                    <span>PUNJAB45990</span>
                </div>
                <div class="bank-row">
                    <span><strong>QR ID</strong></span>
                    <span>transportkart@axisbank</span>
                </div>
            </div>
            
            <div class="payment-details">
                <div class="section-title">Payment Details</div>
                <div class="payment-row">
                    <span>Loading Detention</span>
                    <span>${parseFloat(receipt.detention || 0).toFixed(2)}</span>
                </div>
                <div class="payment-row">
                    <span>Advance Payment</span>
                    <span>${parseFloat(receipt.advance || 0).toFixed(2)}</span>
                </div>
                <div class="payment-row balance">
                    <span>Balance Payment</span>
                    <span>${parseFloat(receipt.balance).toFixed(2)}</span>
                </div>
            </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="terms-section">
            <div class="terms-title">Terms & Conditions</div>
            <div class="terms-columns">
                <div class="terms-column">
                    <div class="terms-item">1. GST will be Paid by Customer / Consignee</div>
                    <div class="terms-item">2. GST exempted is given to H.O to BSCOCO TRANSPORT Company</div>
                    <div class="terms-item">3. In case of Demurrage / Shortage Will not Liable by I/O Truckers EMS</div>
                </div>
                <div class="terms-column">
                    <div class="terms-item">4. After expiry of 3 months will not Liable by I/O Truckers EMS</div>
                    <div class="terms-item">5. Any Type of Deduction Will be Not Accepted Without SMARTEMS Approval</div>
                    <div class="terms-item">6. All claims Subject to City GHAZIABAD Jurisdiction</div>
                </div>
            </div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-logo">📱 SmART-EMS</div>
                <div class="signature-company">TRANSPORTKART</div>
                <div class="signature-authority">Signing Authority</div>
            </div>
        </div>
    </body>
    </html>
  `;
};

const generatePDF = (receipt) => {
  return new Promise((resolve, reject) => {
    const html = generateReceiptHTML(receipt);
    
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      type: 'pdf',
      quality: '100',
      dpi: 300
    };

    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

module.exports = { generatePDF }; 