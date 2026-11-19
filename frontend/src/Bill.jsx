import React, { useState, useEffect } from 'react';
import { X, Printer, ExternalLink, Download } from 'lucide-react';
import { LOGO_BASE64 } from './assets/logoBase64.js';

const API_BASE = (import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`) + '/api';

// Currency formatting helper: e.g. 2623 -> "2,623.00"
const formatCurrency = (num) => {
  if (isNaN(num) || num === null || num === undefined) return '0.00';
  return Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Number to Indian Currency Words Helper Function
function numberToIndianWords(num) {
  if (isNaN(num) || num === null || num === undefined) return 'Rupees Zero and Paisa 0';

  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

  const inWords = (n) => {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + a[n % 10];
    } else {
      str += a[n];
    }
    return str;
  };

  const rounded = Math.round(Number(num) * 100) / 100;
  let intPart = Math.floor(rounded);
  let paisa = Math.round((rounded - intPart) * 100);

  let result = '';
  if (intPart === 0) {
    result = 'Zero ';
  } else {
    const crore = Math.floor(intPart / 10000000);
    intPart %= 10000000;
    if (crore > 0) result += inWords(crore) + 'Crore ';

    const lakh = Math.floor(intPart / 100000);
    intPart %= 100000;
    if (lakh > 0) result += inWords(lakh) + 'Lakh ';

    const thousand = Math.floor(intPart / 1000);
    intPart %= 1000;
    if (thousand > 0) result += inWords(thousand) + 'Thousand ';

    if (intPart > 0) result += inWords(intPart);
  }

  return `InWords (Rupees ${result.trim()} and Paisa ${paisa} )`;
}

const Bill = ({ bill, onClose }) => {
  const [shopSettings, setShopSettings] = useState({
    shop_phone: '8072931982 / 9488845136',
    shop_address: 'SHOP: 553-D, SIVAKASI-SATTUR MAIN ROAD, UDHAYA NAGAR, METTAMALAI, SATTUR T.K. | OFFICE: D.NO 2/8, BURMA COLONY, NARANAPURAM ROAD, SIVAKASI(E) - 626189',
    gst_number: '33AAIFD5733F1ZO'
  });

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then(r => r.json())
      .then(data => setShopSettings(s => ({ ...s, ...data })))
      .catch(() => {});
  }, []);

  // Keyboard shortcut: Press Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!bill) return null;

  // Invoice Number (Admin Provided or formatted)
  const invoiceNo = bill.taxInvoiceNo || bill.invoiceNo || bill.billNumber || bill.id || '1';

  // Format Date: DD.MM.YYYY
  const formatDate = (dateVal) => {
    const d = dateVal ? new Date(dateVal) : new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const invoiceDateStr = formatDate(bill.orderDate || bill.createdAt);

  // Customer Meta
  const customerName = (bill.customerName || 'CUSTOMER').toUpperCase();
  const customerPlace = (bill.place || (bill.city ? bill.city : (bill.address && bill.address !== 'Shop' ? bill.address.split(',')[0] : 'TRICHY'))).toUpperCase();
  const customerMobile = bill.phone || '—';
  const transportName = (bill.transportInfo || bill.transport || '').toUpperCase();

  // Items & Calculations
  const rawItems = bill.items ? (typeof bill.items === 'string' ? JSON.parse(bill.items) : bill.items) : [];
  const items = rawItems.map(item => ({
    name: item.name,
    rate: Number(item.price) || 0,
    qty: Number(item.qty) || 1,
    amount: (Number(item.price) || 0) * (Number(item.qty) || 1)
  }));

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const netAmount = Number(bill.totalAmount) || items.reduce((sum, item) => sum + item.amount, 0);
  const grossTotal = netAmount;

  // GST Calculation (18% inclusive)
  // Taxable = Net / 1.18
  const taxableAmount = Math.round((netAmount / 1.18) * 100) / 100;
  const totalTax = Math.round((netAmount - taxableAmount) * 100) / 100;

  // State Detection (Tamil Nadu Intrastate vs Interstate like Kerala, Karnataka, Andhra Pradesh, etc.)
  const rawState = (bill.state || '').trim().toLowerCase();
  const addressStr = (bill.address || '').toLowerCase();
  const placeStr = (bill.place || '').toLowerCase();

  let isTamilNadu = true;
  if (bill.isCounterSale) {
    isTamilNadu = true;
  } else if (rawState) {
    isTamilNadu = rawState.includes('tamil') || rawState === 'tn';
  } else if (
    addressStr.includes('kerala') ||
    addressStr.includes('karnataka') ||
    addressStr.includes('andhra') ||
    addressStr.includes('telangana') ||
    addressStr.includes('maharashtra') ||
    addressStr.includes('bengaluru') ||
    addressStr.includes('bangalore') ||
    addressStr.includes('kochi') ||
    addressStr.includes('cochin') ||
    addressStr.includes('trivandrum') ||
    addressStr.includes('palakkad') ||
    placeStr.includes('bangalore') ||
    placeStr.includes('bengaluru') ||
    placeStr.includes('palakkad') ||
    placeStr.includes('kochi')
  ) {
    isTamilNadu = false;
  } else {
    isTamilNadu = true;
  }

  const cgstAmount = isTamilNadu ? Math.round((totalTax / 2) * 100) / 100 : 0;
  const sgstAmount = isTamilNadu ? Math.round((totalTax - cgstAmount) * 100) / 100 : 0;
  const igstAmount = !isTamilNadu ? totalTax : 0;

  const inWordsString = numberToIndianWords(netAmount);

  // Minimum 11 rows to ensure professional A4 sheet proportion (matching BILL 16.pdf)
  const minRows = 11;
  const fillerCount = Math.max(0, minRows - items.length);
  const fillerRows = Array.from({ length: fillerCount }, (_, i) => items.length + i + 1);

  // Generates Clean Standalone HTML for Printing and Exporting
  const generateStandaloneHTML = () => {
    const itemsHtml = items.map((item, idx) => `
      <tr>
        <td style="border: 1px solid #000; padding: 5px 4px; text-align: center; font-size: 13px; font-weight: bold;">${idx + 1}</td>
        <td style="border: 1px solid #000; padding: 5px 10px; font-size: 13px; font-weight: bold; text-transform: uppercase;">${item.name}</td>
        <td style="border: 1px solid #000; padding: 5px 4px; text-align: center; font-size: 13px;">${item.rate}</td>
        <td style="border: 1px solid #000; padding: 5px 4px; text-align: center; font-size: 13px; font-weight: bold;">${item.qty}</td>
        <td style="border: 1px solid #000; padding: 5px 10px; text-align: right; font-size: 13px; font-weight: bold;">${formatCurrency(item.amount)}</td>
      </tr>
    `).join('');

    const fillerHtml = fillerRows.map(() => `
      <tr style="height: 25px;">
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>BILL ${invoiceNo}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 8mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: Arial, Helvetica, sans-serif;
      width: 100%;
    }
    @media print {
      body {
        padding: 0 !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .bill-container {
        border: 2px solid #000 !important;
        margin: 0 auto !important;
        width: 100% !important;
        box-shadow: none !important;
      }
    }
    .no-print-bar {
      max-width: 780px;
      margin: 15px auto;
      background: #0f172a;
      color: #fff;
      padding: 12px 20px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .btn-action-print {
      background: #16a34a;
      color: #fff;
      border: none;
      padding: 9px 20px;
      border-radius: 8px;
      font-weight: 800;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-action-close {
      background: #dc2626;
      color: #fff;
      border: none;
      padding: 9px 18px;
      border-radius: 8px;
      font-weight: 800;
      cursor: pointer;
      font-size: 14px;
    }
    .bill-container {
      width: 100%;
      max-width: 780px;
      margin: 10px auto;
      border: 2px solid #000 !important;
      background: #fff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td, th {
      border: 1px solid #000;
    }
    .banner-black {
      background-color: #000000 !important;
      box-shadow: inset 0 0 0 1000px #000000 !important;
      color: #ffffff !important;
      text-align: center;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 2.5px;
      padding: 6px 0;
      border-top: 2px solid #000 !important;
      border-bottom: 2px solid #000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  </style>
</head>
<body>
  <!-- Print Prompt Banner for Standalone Tabs -->
  <div class="no-print-bar">
    <div>
      <div style="font-weight: 900; font-size: 15px;">DURGA AGENCIES — TAX INVOICE NO : ${invoiceNo}</div>
      <div style="font-size: 12px; opacity: 0.8; margin-top: 3px;">
        💡 Click <b>[SAVE AS PDF]</b> -> Set Destination to <b>"Save as PDF"</b> -> Click Save!
      </div>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="btn-action-print" onclick="window.print()">🖨️ SAVE AS PDF / PRINT</button>
      <button class="btn-action-close" onclick="window.close()">✕ CLOSE</button>
    </div>
  </div>

  <div class="bill-container">
    <!-- 1. Header with Circular Logo & Durga Agencies Info -->
    <table style="border: none;">
      <tr>
        <td style="width: 135px; border: none; border-right: 2px solid #000 !important; text-align: center; vertical-align: middle; padding: 10px;">
          <img src="${LOGO_BASE64}" style="width: 95px; height: 95px; object-fit: contain;" alt="Logo" />
        </td>
        <td style="border: none; text-align: center; padding: 8px 12px;">
          <div style="font-size: 24px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 4px;">DURGA AGENCIES</div>
          <div style="font-size: 11px; font-weight: 700; line-height: 1.35; max-width: 550px; margin: 0 auto;">
            ${shopSettings.shop_address || 'SHOP: 553-D, SIVAKASI-SATTUR MAIN ROAD, UDHAYA NAGAR, METTAMALAI, SATTUR T.K. | OFFICE: D.NO 2/8, BURMA COLONY, NARANAPURAM ROAD, SIVAKASI(E) - 626189'}
          </div>
          <div style="font-size: 12px; font-weight: 800; margin-top: 4px;">
            MOBILE: ${shopSettings.shop_phone || '8072931982 / 9488845136'}
          </div>
          <div style="font-size: 13px; font-weight: 900; margin-top: 3px;">
            GST : ${shopSettings.gst_number || '33AAIFD5733F1ZO'}
          </div>
        </td>
      </tr>
    </table>

    <!-- 2. Solid Jet Black Banner: TAX INVOICE -->
    <div class="banner-black">TAX INVOICE</div>

    <!-- 3. Customer Meta Information: Continuous 58% / 42% Two-Column Grid -->
    <table>
      <tr>
        <td style="width: 58%; padding: 6px 10px; font-weight: bold; font-size: 13px;">
          NAME &nbsp;: &nbsp;<span>${customerName}</span>
        </td>
        <td style="width: 42%; padding: 6px 10px; font-weight: bold; font-size: 13px;">
          Tax Invoice No : &nbsp;<span>${invoiceNo}</span>
        </td>
      </tr>
      <tr>
        <td style="width: 58%; padding: 6px 10px; font-weight: bold; font-size: 13px;">
          PLACE &nbsp;: &nbsp;<span>${customerPlace}</span>
        </td>
        <td rowspan="2" style="width: 42%; padding: 6px 10px; text-align: center; vertical-align: middle; font-weight: bold; font-size: 14px;">
          ${invoiceDateStr}
        </td>
      </tr>
      <tr>
        <td style="width: 58%; padding: 0;">
          <table style="border: none;">
            <tr>
              <td style="width: 110px; border: none; border-right: 1px solid #000; font-weight: bold; padding: 6px 10px; font-size: 12px; line-height: 1.2;">
                MOBILE<br/>NO
              </td>
              <td style="border: none; font-weight: bold; padding: 6px 10px; vertical-align: middle; font-size: 13px;">
                ${customerMobile}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- 4. Products Table -->
    <table style="margin-top: -1px;">
      <thead>
        <tr style="background: #fff;">
          <th style="width: 48px; padding: 6px 4px; font-size: 13px;">S.NO</th>
          <th style="text-align: left; padding-left: 12px; font-size: 13px;">Name of the Product</th>
          <th style="width: 85px; padding: 6px 4px; font-size: 13px;">Rate<br/>(₹)</th>
          <th style="width: 95px; padding: 6px 4px; font-size: 13px;">No.Of.<br/>Quantity</th>
          <th style="width: 120px; text-align: right; padding-right: 12px; font-size: 13px;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        ${fillerHtml}
      </tbody>
      <tfoot>
        <!-- Transport & Total Quantity Row -->
        <tr>
          <td colspan="3" style="width: 58%; padding: 8px 12px; font-weight: bold; font-size: 13px;">
            TRANSPORT : &nbsp;<span>${transportName}</span>
          </td>
          <td style="width: 95px; text-align: center; padding: 6px 4px;">
            <div style="font-size: 10.5px; font-weight: bold; margin-bottom: 2px;">TOTAL QUANTITY</div>
            <div style="font-size: 15px; font-weight: 900;">${totalQty}</div>
          </td>
          <td style="width: 120px;"></td>
        </tr>
      </tfoot>
    </table>

    <!-- 5. Summary Section & Exact 6-Row GST Calculation Table -->
    <table style="margin-top: -1px;">
      <tr>
        <!-- Left Column: Legal Terms & Signatory (58% width) -->
        <td style="width: 58%; padding: 10px 14px; vertical-align: top; position: relative;">
          <div style="font-size: 13px; font-weight: 900; margin-bottom: 4px;">HSN CODE : 3604</div>
          <div style="font-size: 11px; font-style: italic; color: #333; margin-bottom: 45px;">
            All disputes comes under sivakasi jurisdiction.
          </div>
          <div style="text-align: center; width: 100%;">
            <div style="font-size: 13px; font-weight: bold;">For</div>
            <div style="font-size: 14px; font-weight: 900; margin-top: 2px;">DURGA AGENCIES</div>
            <div style="font-size: 11.5px; font-weight: bold; color: #444; margin-top: 2px;">(Authorised Signatory)</div>
          </div>
        </td>

        <!-- Right Column: Exact 6-Row Tax Calculation Table (42% width) -->
        <td style="width: 42%; padding: 0; vertical-align: top;">
          <table style="border: none;">
            <tr>
              <td colspan="2" style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; font-weight: bold;">Gross Total (MRP)</td>
              <td style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; text-align: right; font-weight: bold;">${formatCurrency(grossTotal)}</td>
            </tr>
            <tr>
              <td colspan="2" style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; font-weight: bold;">Taxable Amount</td>
              <td style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; text-align: right; font-weight: bold;">${formatCurrency(taxableAmount)}</td>
            </tr>
            <tr>
              <td colspan="${isTamilNadu ? 2 : 1}" style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; font-weight: bold;">IGST</td>
              ${!isTamilNadu ? '<td style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 11.5px; text-align: center; font-weight: bold; width: 45px;">18%</td>' : ''}
              <td style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; text-align: right; font-weight: bold;">${!isTamilNadu ? formatCurrency(igstAmount) : '-'}</td>
            </tr>
            <tr>
              <td style="border: none; border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 5px 8px; font-size: 13px; font-weight: bold;">SGST</td>
              <td style="border: none; border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 5px 8px; font-size: 11.5px; text-align: center; font-weight: bold; width: 45px;">${isTamilNadu ? '9%' : ''}</td>
              <td style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; text-align: right; font-weight: bold;">${isTamilNadu ? formatCurrency(sgstAmount) : '-'}</td>
            </tr>
            <tr>
              <td style="border: none; border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 5px 8px; font-size: 13px; font-weight: bold;">CGST</td>
              <td style="border: none; border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 5px 8px; font-size: 11.5px; text-align: center; font-weight: bold; width: 45px;">${isTamilNadu ? '9%' : ''}</td>
              <td style="border: none; border-bottom: 1px solid #000; padding: 5px 8px; font-size: 13px; text-align: right; font-weight: bold;">${isTamilNadu ? formatCurrency(cgstAmount) : '-'}</td>
            </tr>
            <tr style="background: #fafafa;">
              <td colspan="2" style="border: none; padding: 6px 8px; font-size: 15px; font-weight: 900;">Net Amount</td>
              <td style="border: none; padding: 6px 8px; font-size: 16px; text-align: right; font-weight: 900;">${formatCurrency(netAmount)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- 6. Bottom Full Width Banner: In Words -->
    <div style="border-top: 2px solid #000 !important; padding: 7px 12px; font-size: 12px; font-weight: bold; text-align: center;">
      ${inWordsString}
    </div>
  </div>
</body>
</html>`;
  };

  // Direct 1-Click Save as PDF via Isolated Iframe (No popup blocking, auto-named BILL <no>.pdf)
  const handleSaveAsPDF = () => {
    const html = generateStandaloneHTML();
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Trigger Print once loaded
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        window.print();
      }
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch (e) {}
      }, 3000);
    }, 400);
  };

  // Open in New Standalone Tab
  const handleOpenNewTab = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup was blocked by your browser. Please click the green "SAVE AS PDF / PRINT" button directly.');
      return;
    }
    const html = generateStandaloneHTML();
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // 1-Click Download Standalone Bill File
  const handleDownloadBillFile = () => {
    const html = generateStandaloneHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BILL_${invoiceNo}_${customerName.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="bill-modal-overlay"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', overflowY: 'auto'
      }}
    >
      <div
        className="bill-modal-content"
        style={{
          background: '#fff', borderRadius: '16px', maxWidth: '830px', width: '100%',
          maxHeight: '94vh', overflowY: 'auto', padding: '20px 24px', position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
        }}
      >
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#121212', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>TAX INVOICE BILL #{invoiceNo}</span>
              <span style={{ background: isTamilNadu ? '#e6fffa' : '#ebf8ff', color: isTamilNadu ? '#234e52' : '#2a4365', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                {isTamilNadu ? 'Tamil Nadu (CGST 9% + SGST 9%)' : `${bill.state || 'Interstate'} (IGST 18%)`}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              Customer: <b>{customerName}</b> | Date: <b>{invoiceDateStr}</b>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSaveAsPDF}
              style={{
                padding: '0.65rem 1.4rem', background: '#16a34a', color: '#fff',
                display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px',
                fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', border: 'none',
                boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
              }}
              title="Save as official A4 Tax Invoice PDF"
            >
              <Printer size={16} /> 🖨️ SAVE AS PDF / PRINT
            </button>

            <button
              onClick={handleDownloadBillFile}
              style={{
                padding: '0.65rem 1.1rem', background: '#082854', color: '#fff',
                display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px',
                fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', border: 'none'
              }}
              title="Download standalone file to share via WhatsApp or Email"
            >
              <Download size={15} /> 📥 Download
            </button>

            <button
              onClick={handleOpenNewTab}
              style={{
                padding: '0.65rem 1rem', background: '#f8fafc', color: '#334155',
                display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '8px',
                fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer', border: '1px solid #cbd5e1'
              }}
              title="Open full page in a new browser tab"
            >
              <ExternalLink size={15} /> Open Tab
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '0.65rem 1.2rem', background: '#dc2626', color: '#fff',
                borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.9rem',
                border: 'none', display: 'flex', alignItems: 'center', gap: '5px'
              }}
              title="Close Preview (or press Escape)"
            >
              <X size={16} /> CLOSE
            </button>
          </div>
        </div>

        {/* The Exact Tax Invoice Document (Replicating BILL 16.pdf 1:1) */}
        <div
          id="printable-tax-invoice"
          style={{
            border: '2px solid #000', margin: '0 auto', maxWidth: '780px',
            background: '#fff', color: '#000', fontFamily: 'Arial, Helvetica, sans-serif'
          }}
        >
          {/* 1. Header with Circular Logo & Durga Agencies Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '135px', borderRight: '2px solid #000', textAlign: 'center', verticalAlign: 'middle', padding: '10px' }}>
                  <img src={LOGO_BASE64} style={{ width: '95px', height: '95px', objectFit: 'contain' }} alt="Logo" />
                </td>
                <td style={{ textAlign: 'center', padding: '8px 12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1.5px', marginBottom: '4px' }}>DURGA AGENCIES</div>
                  <div style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.35', maxWidth: '550px', margin: '0 auto' }}>
                    {shopSettings.shop_address || 'SHOP: 553-D, SIVAKASI-SATTUR MAIN ROAD, UDHAYA NAGAR, METTAMALAI, SATTUR T.K. | OFFICE: D.NO 2/8, BURMA COLONY, NARANAPURAM ROAD, SIVAKASI(E) - 626189'}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', marginTop: '4px' }}>
                    MOBILE: {shopSettings.shop_phone || '8072931982 / 9488845136'}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '900', marginTop: '3px' }}>
                    GST : {shopSettings.gst_number || '33AAIFD5733F1ZO'}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 2. Solid Deep Jet Black Banner: TAX INVOICE */}
          <div
            style={{
              backgroundColor: '#000000',
              boxShadow: 'inset 0 0 0 1000px #000000',
              color: '#ffffff',
              textAlign: 'center',
              fontSize: '15px',
              fontWeight: '900',
              letterSpacing: '2.5px',
              padding: '6px 0',
              borderTop: '2px solid #000',
              borderBottom: '2px solid #000'
            }}
          >
            TAX INVOICE
          </div>

          {/* 3. Customer Meta Information: Continuous 58% / 42% Two-Column Grid */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '6px 10px', width: '58%', fontWeight: 'bold' }}>
                  NAME &nbsp;: &nbsp;<span>{customerName}</span>
                </td>
                <td style={{ border: '1px solid #000', padding: '6px 10px', width: '42%', fontWeight: 'bold' }}>
                  Tax Invoice No : &nbsp;<span>{invoiceNo}</span>
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: '6px 10px', width: '58%', fontWeight: 'bold' }}>
                  PLACE &nbsp;: &nbsp;<span>{customerPlace}</span>
                </td>
                <td
                  rowSpan={2}
                  style={{
                    border: '1px solid #000', padding: '6px 10px', width: '42%',
                    textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', fontSize: '14px'
                  }}
                >
                  {invoiceDateStr}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 0, width: '58%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', height: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '110px', border: 'none', borderRight: '1px solid #000', fontWeight: 'bold', padding: '6px 10px', fontSize: '12px', lineHeight: '1.2' }}>
                          MOBILE<br />NO
                        </td>
                        <td style={{ border: 'none', fontWeight: 'bold', padding: '6px 10px', verticalAlign: 'middle' }}>
                          {customerMobile}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 4. Products Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '-1px' }}>
            <thead>
              <tr style={{ background: '#fff' }}>
                <th style={{ border: '1px solid #000', padding: '6px 4px', width: '48px', textAlign: 'center', fontSize: '13px' }}>S.NO</th>
                <th style={{ border: '1px solid #000', padding: '6px 10px', textAlign: 'left', fontSize: '13px' }}>Name of the Product</th>
                <th style={{ border: '1px solid #000', padding: '6px 4px', width: '85px', textAlign: 'center', fontSize: '13px' }}>Rate<br />(₹)</th>
                <th style={{ border: '1px solid #000', padding: '6px 4px', width: '95px', textAlign: 'center', fontSize: '13px' }}>No.Of.<br />Quantity</th>
                <th style={{ border: '1px solid #000', padding: '6px 10px', width: '120px', textAlign: 'right', fontSize: '13px' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: '5px 10px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.name}</td>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center', fontSize: '13px' }}>{item.rate}</td>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>{item.qty}</td>
                  <td style={{ border: '1px solid #000', padding: '5px 10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              {fillerRows.map((_, fIdx) => (
                <tr key={`filler-${fIdx}`} style={{ height: '25px' }}>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000' }}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/* Transport & Total Quantity Row */}
              <tr>
                <td colSpan={3} style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', width: '58%' }}>
                  TRANSPORT : &nbsp;<span>{transportName}</span>
                </td>
                <td style={{ border: '1px solid #000', textAlign: 'center', padding: '6px 4px', width: '95px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 'bold', marginBottom: '2px' }}>TOTAL QUANTITY</div>
                  <div style={{ fontSize: '15px', fontWeight: '900' }}>{totalQty}</div>
                </td>
                <td style={{ border: '1px solid #000', width: '120px' }}></td>
              </tr>
            </tfoot>
          </table>

          {/* 5. Summary Section & Exact 6-Row GST Calculation Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '-1px' }}>
            <tbody>
              <tr>
                {/* Left Side: Jurisdiction & Signature (58% width) */}
                <td style={{ border: '1px solid #000', width: '58%', padding: '10px 14px', verticalAlign: 'top', position: 'relative' }}>
                  <div style={{ fontSize: '13px', fontWeight: '900', marginBottom: '4px' }}>HSN CODE : 3604</div>
                  <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#333', marginBottom: '45px' }}>
                    All disputes comes under sivakasi jurisdiction.
                  </div>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>For</div>
                    <div style={{ fontSize: '14px', fontWeight: '900', marginTop: '2px' }}>DURGA AGENCIES</div>
                    <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#444', marginTop: '2px' }}>(Authorised Signatory)</div>
                  </div>
                </td>

                {/* Right Side: Exact 6-Row Tax Calculation Table (42% width) */}
                <td style={{ border: '1px solid #000', width: '42%', padding: 0, verticalAlign: 'top' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td colSpan={2} style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', fontWeight: 'bold' }}>Gross Total (MRP)</td>
                        <td style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(grossTotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', fontWeight: 'bold' }}>Taxable Amount</td>
                        <td style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(taxableAmount)}</td>
                      </tr>
                      <tr>
                        <td colSpan={isTamilNadu ? 2 : 1} style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', fontWeight: 'bold' }}>IGST</td>
                        {!isTamilNadu && <td style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '11.5px', textAlign: 'center', fontWeight: 'bold', width: '45px' }}>18%</td>}
                        <td style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>{!isTamilNadu ? formatCurrency(igstAmount) : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '5px 8px', fontSize: '13px', fontWeight: 'bold' }}>SGST</td>
                        <td style={{ borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '5px 8px', fontSize: '11.5px', textAlign: 'center', fontWeight: 'bold', width: '45px' }}>{isTamilNadu ? '9%' : ''}</td>
                        <td style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>{isTamilNadu ? formatCurrency(sgstAmount) : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '5px 8px', fontSize: '13px', fontWeight: 'bold' }}>CGST</td>
                        <td style={{ borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '5px 8px', fontSize: '11.5px', textAlign: 'center', fontWeight: 'bold', width: '45px' }}>{isTamilNadu ? '9%' : ''}</td>
                        <td style={{ borderBottom: '1px solid #000', padding: '5px 8px', fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>{isTamilNadu ? formatCurrency(cgstAmount) : '-'}</td>
                      </tr>
                      <tr style={{ background: '#fafafa' }}>
                        <td colSpan={2} style={{ padding: '6px 8px', fontSize: '15px', fontWeight: '900' }}>Net Amount</td>
                        <td style={{ padding: '6px 8px', fontSize: '16px', textAlign: 'right', fontWeight: '900' }}>{formatCurrency(netAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 6. Bottom Full Width Banner: In Words */}
          <div style={{ borderTop: '2px solid #000', padding: '7px 12px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
            {inWordsString}
          </div>
        </div>

        {/* Action Buttons at Bottom */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={handleSaveAsPDF}
            style={{
              padding: '0.8rem 2rem', background: '#16a34a', color: '#fff',
              display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px',
              fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', border: 'none',
              boxShadow: '0 4px 15px rgba(22,163,74,0.3)'
            }}
          >
            <Printer size={18} /> 🖨️ SAVE AS PDF / PRINT NOW
          </button>

          <button
            onClick={handleDownloadBillFile}
            style={{
              padding: '0.8rem 1.6rem', background: '#082854', color: '#fff',
              display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px',
              fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', border: 'none'
            }}
          >
            <Download size={16} /> 📥 Download Bill
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '0.8rem 1.8rem', background: '#dc2626', border: 'none',
              borderRadius: '8px', fontWeight: '900', cursor: 'pointer', color: '#fff',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <X size={18} /> CLOSE PREVIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
