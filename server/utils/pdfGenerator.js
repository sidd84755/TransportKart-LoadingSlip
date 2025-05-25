const pdf = require('html-pdf');
const moment = require('moment');

const generateReceiptHTML = (receipt) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .company-name {
                font-size: 24px;
                font-weight: bold;
                color: #2e7d32;
                margin-bottom: 5px;
            }
            .subtitle {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
            }
            .contact-info {
                font-size: 12px;
                line-height: 1.4;
            }
            .loading-slip-title {
                background-color: #f5f5f5;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                margin: 20px 0;
                border: 1px solid #ddd;
            }
            .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .info-left, .info-right {
                width: 48%;
            }
            .info-row {
                margin-bottom: 8px;
                font-size: 14px;
            }
            .label {
                font-weight: bold;
                display: inline-block;
                width: 120px;
            }
            .content-section {
                margin: 20px 0;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .table th, .table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 12px;
            }
            .table th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            .bank-section {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
            }
            .bank-info, .payment-info {
                width: 48%;
                border: 1px solid #ddd;
                padding: 15px;
            }
            .section-title {
                font-weight: bold;
                margin-bottom: 10px;
                background-color: #f5f5f5;
                padding: 5px;
                text-align: center;
            }
            .terms {
                font-size: 11px;
                line-height: 1.4;
                margin: 20px 0;
            }
            .terms ol {
                padding-left: 20px;
            }
            .signature-section {
                text-align: right;
                margin-top: 40px;
            }
            .signature-box {
                border: 1px solid #ddd;
                width: 200px;
                height: 100px;
                margin-left: auto;
                padding: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company-name">SmART-EMS</div>
            <div class="company-name" style="color: #2e7d32;">TRANSPORTKART</div>
            <div class="subtitle">Reg. Office: H-48, Sriram Colony, Loni, Ghaziabad, Uttar Pradesh - 201102</div>
            <div class="subtitle">GSTIN: 09DTIPK6278L1ZU &nbsp;&nbsp;&nbsp;&nbsp; PAN No. DTIPK6278L</div>
            <div class="contact-info">
                📧 connect@transportkart.com &nbsp;&nbsp; 📞 +917827568795 &nbsp;&nbsp; 🌐 www.transportkart.com
            </div>
        </div>

        <div class="loading-slip-title">Loading Slip</div>

        <div class="info-section">
            <div class="info-left">
                <div class="info-row">
                    <span class="label">Customer Name:</span>
                    <span>${receipt.customerName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Address:</span>
                    <span>${receipt.customerAddress}</span>
                </div>
            </div>
            <div class="info-right">
                <div class="info-row">
                    <span class="label">Loading Slip No.:</span>
                    <span>${receipt.loadingSlipNo}</span>
                </div>
                <div class="info-row">
                    <span class="label">Loading Date:</span>
                    <span>${moment(receipt.loadingDate).format('DD-MM-YYYY')}</span>
                </div>
            </div>
        </div>

        <div class="content-section">
            <p style="margin-bottom: 15px;">Dear Sir / Madam,</p>
            <p style="margin-bottom: 15px;">
                We are sending our truck based on our earlier discussion regarding the same. Requesting you please prepare load for the below truck on our behalf & oblige. Upcoming
            </p>
            <p style="margin-bottom: 20px;">
                loading on Dated: <strong>${moment(receipt.loadingDate).format('DD-MM-YYYY')}</strong>.
            </p>
        </div>

        <table class="table">
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
                    <td>Full Load</td>
                    <td>${receipt.fromCity} - ${receipt.toCity}</td>
                    <td>${receipt.vehicleNo}</td>
                    <td>${receipt.driverNumber}</td>
                    <td>${receipt.vehicleType}</td>
                    <td>${receipt.truckType}</td>
                    <td>${receipt.material}</td>
                    <td>${receipt.freight.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>

        <div class="bank-section">
            <div class="bank-info">
                <div class="section-title">Bank Information For Payment</div>
                <div style="font-size: 12px;">
                    <div style="margin-bottom: 5px;"><strong>Payee Name:</strong> SMART EMS</div>
                    <div style="margin-bottom: 5px;"><strong>Account Number:</strong> 455900210005230</div>
                    <div style="margin-bottom: 5px;"><strong>IFSC Code:</strong> PUNB0455900</div>
                    <div style="margin-bottom: 5px;"><strong>QR ID:</strong> transportkart@apl</div>
                </div>
            </div>
            <div class="payment-info">
                <div class="section-title">Payment Details</div>
                <div style="font-size: 12px;">
                    <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>Loading Detention</span>
                        <span>${receipt.detention.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>Advance Payment</span>
                        <span>${receipt.advance.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 8px; display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 8px; font-weight: bold;">
                        <span>Balance Payment</span>
                        <span>${receipt.balance.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin: 20px 0;">
            <div style="font-weight: bold; margin-bottom: 10px;">Ownership: ${receipt.ownership}</div>
            ${receipt.remark ? `<div><strong>Remark:</strong> ${receipt.remark}</div>` : ''}
        </div>

        <div class="terms">
            <strong>Terms & Conditions:</strong>
            <ol>
                <li>GST Will be Paid by Consigner / Consignee</li>
                <li>GST exempted is given on hire to GOODS TRANSPORT Company</li>
                <li>Any Type Of Damage / Shortage Will Not Liability Of SmART-EMS</li>
                <li>If Material Will Theft Then No Any Deduction Will Be Accepted. Settle Loss With Insurance Company.</li>
                <li>Any Type Of Deduction Will Be Not Accepted Without SmART-EMS Approval</li>
                <li>All Dispute Subject To Our GHAZIABAD Jurisdiction</li>
            </ol>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div style="font-weight: bold; margin-bottom: 20px;">SmART-EMS</div>
                <div style="font-weight: bold;">TRANSPORTKART</div>
                <div style="font-size: 12px; margin-top: 10px;">Signing Authority</div>
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
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
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