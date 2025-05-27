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
                margin: 0.3in;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                font-size: 11px;
                line-height: 1.2;
                color: #000;
            }
            
            .loading-slip-header {
                background-color: #f0f0f0;
                padding: 8px;
                text-align: center;
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
            }
            
            .header-section {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 20px;
                border-bottom: 2px solid #000;
                padding-bottom: 15px;
            }
            
            .logo-container {
                width: 80px;
                text-align: center;
            }
            
            .logo-img {
                width: 60px;
                height: 60px;
                background: #4CAF50;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 5px;
            }
            
            .logo-text {
                font-size: 8px;
                font-weight: bold;
                color: #4CAF50;
            }
            
            .company-details {
                flex: 1;
                text-align: center;
                padding: 0 20px;
            }
            
            .smart-ems {
                color: #d32f2f;
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 2px;
            }
            
            .company-name {
                font-size: 20px;
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 8px;
            }
            
            .reg-office {
                font-size: 9px;
                margin-bottom: 3px;
            }
            
            .tax-details {
                font-size: 9px;
                font-weight: bold;
            }
            
            .contact-info {
                width: 200px;
                text-align: right;
                font-size: 9px;
                line-height: 1.3;
            }
            
            .contact-row {
                margin-bottom: 2px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            
            .contact-icon {
                margin-right: 3px;
            }
            
            .customer-loading-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                border-bottom: 1px solid #000;
                padding-bottom: 15px;
            }
            
            .customer-section, .loading-section {
                width: 48%;
            }
            
            .info-line {
                margin-bottom: 8px;
                display: flex;
            }
            
            .info-label {
                font-weight: bold;
                width: 120px;
                margin-right: 10px;
            }
            
            .info-value {
                flex: 1;
                border-bottom: 1px solid #000;
                padding-bottom: 2px;
            }
            
            .letter-content {
                margin: 20px 0;
                text-align: justify;
                line-height: 1.4;
            }
            
            .greeting {
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .letter-text {
                margin-bottom: 10px;
            }
            
            .loading-date {
                text-decoration: underline;
                font-weight: bold;
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
                font-weight: bold;
                font-size: 10px;
            }
            
            .details-table td {
                border: 1px solid #000;
                padding: 8px 4px;
                text-align: center;
                font-size: 10px;
            }
            
            .payment-section {
                display: flex;
                gap: 20px;
                margin: 25px 0;
            }
            
            .bank-box, .payment-box {
                flex: 1;
                border: 2px solid #000;
                padding: 12px;
            }
            
            .box-title {
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
                text-decoration: underline;
                font-size: 11px;
            }
            
            .bank-row, .payment-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 10px;
            }
            
            .bank-label {
                font-weight: bold;
                width: 100px;
            }
            
            .payment-row.balance {
                font-weight: bold;
                border-top: 1px solid #000;
                padding-top: 6px;
                margin-top: 8px;
            }
            
            .terms-section {
                margin: 25px 0;
            }
            
            .terms-title {
                font-weight: bold;
                text-decoration: underline;
                margin-bottom: 10px;
                font-size: 11px;
            }
            
            .terms-list {
                font-size: 9px;
                line-height: 1.3;
            }
            
            .terms-list ol {
                padding-left: 15px;
            }
            
            .terms-list li {
                margin-bottom: 4px;
            }
            
            .signature-section {
                margin-top: 30px;
                text-align: right;
            }
            
            .signature-box {
                display: inline-block;
                border: 2px solid #000;
                padding: 20px;
                text-align: center;
                width: 180px;
            }
            
            .signature-title {
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 5px;
            }
            
            .signature-company {
                font-weight: bold;
                font-size: 11px;
                margin-bottom: 15px;
            }
            
            .signature-authority {
                font-size: 10px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <!-- Loading Slip Header -->
        <div class="loading-slip-header">Loading Slip</div>
        
        <!-- Header Section -->
        <div class="header-section">
            <div class="logo-container">
                <div class="logo-img">🚛</div>
                <div class="logo-text">TRANSPORTKART</div>
            </div>
            
            <div class="company-details">
                <div class="smart-ems">SmART-EMS</div>
                <div class="company-name">TRANSPORTKART</div>
                <div class="reg-office">Reg. Office : H-48, Shriram Colony, Loni, Ghaziabad, Uttar Pradesh - 201102</div>
                <div class="tax-details">GSTIN : 09DTIPK6278L1ZU &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; PAN No. DTIPK6278L</div>
            </div>
            
            <div class="contact-info">
                <div class="contact-row">
                    <span class="contact-icon">📧</span>
                    <span>connect@transportkart.com</span>
                </div>
                <div class="contact-row">
                    <span class="contact-icon">📞</span>
                    <span>+91-7827568785</span>
                </div>
                <div class="contact-row">
                    <span class="contact-icon">🌐</span>
                    <span>www.transportkart.com</span>
                </div>
            </div>
        </div>

        <!-- Customer and Loading Information -->
        <div class="customer-loading-row">
            <div class="customer-section">
                <div class="info-line">
                    <span class="info-label">Customer Name :</span>
                    <span class="info-value">${receipt.customerName}</span>
                </div>
                <div class="info-line">
                    <span class="info-label">Address :</span>
                    <span class="info-value">${receipt.customerAddress}</span>
                </div>
            </div>
            
            <div class="loading-section">
                <div class="info-line">
                    <span class="info-label">Loading Slip No. :</span>
                    <span class="info-value">${receipt.loadingSlipNo}</span>
                </div>
                <div class="info-line">
                    <span class="info-label">Loading Date :</span>
                    <span class="info-value">${moment(receipt.loadingDate).format('DD-MM-YYYY')}</span>
                </div>
            </div>
        </div>

        <!-- Letter Content -->
        <div class="letter-content">
            <div class="greeting">Dear Sir / Madam,</div>
            <div class="letter-text">
                We are sending our truck based on our earlier discussion regarding the same. Requesting you please prepare load for the below truck on our behalf & oblige. Upcoming
            </div>
            <div class="letter-text">
                loading on Dated : <span class="loading-date">${moment(receipt.loadingDate).format('DD-MM-YYYY')}</span> .
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
                    <td>18 Ton</td>
                    <td>${receipt.material}</td>
                    <td>${parseFloat(receipt.freight).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>

        <!-- Payment Section -->
        <div class="payment-section">
            <div class="bank-box">
                <div class="box-title">Bank Information For Payment</div>
                <div class="bank-row">
                    <span class="bank-label">Payee Name</span>
                    <span>SMART EMS</span>
                </div>
                <div class="bank-row">
                    <span class="bank-label">Account Number</span>
                    <span>459900210005230</span>
                </div>
                <div class="bank-row">
                    <span class="bank-label">IFSC Code</span>
                    <span>PUNB0455900</span>
                </div>
                <div class="bank-row">
                    <span class="bank-label">QR ID</span>
                    <span>transportkart@axl</span>
                </div>
            </div>
            
            <div class="payment-box">
                <div class="box-title">Payment Details</div>
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
            <div class="terms-list">
                <ol>
                    <li>GST will be Paid By Consigner / Consignee</li>
                    <li>GST exempted is given on hire to GOODS TRANSPORT Company</li>
                    <li>Any Type Of Damage / Shortage Will Not Liability Of SmART-EMS</li>
                    <li>If Material Will Theft Then No Any Deduction Will Be Accepted. Settle Loss With Insurance Company.</li>
                    <li>Any Type Of Deduction Will Be Not Accepted Without SmART-EMS Approval</li>
                    <li>All Dispute Subject To Our GHAZIABAD Jurisdiction</li>
                </ol>
            </div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-title">SmART-EMS</div>
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
        top: '0.3in',
        right: '0.3in',
        bottom: '0.3in',
        left: '0.3in'
      },
      type: 'pdf',
      quality: '100'
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