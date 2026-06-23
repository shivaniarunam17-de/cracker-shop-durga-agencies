import React from 'react';
import { X, Printer } from 'lucide-react';

const Bill = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    const itemsHTML = bill.items && bill.items.map((item, idx) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px; font-weight: bold;">${item.name}</td>
        <td style="padding: 10px; text-align: right;">&#8377;${Number(item.price).toFixed(2)}</td>
        <td style="padding: 10px; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold;">&#8377;${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Invoice - ${bill.billNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #333; line-height: 1.5; padding: 10px; }
          .invoice-box { width: 100%; max-width: 800px; margin: auto; }
          .header-table { width: 100%; border-bottom: 3px double #082854; padding-bottom: 15px; margin-bottom: 20px; }
          .shop-name { font-size: 28px; font-weight: 800; color: #082854; text-transform: uppercase; }
          .shop-details { font-size: 11px; color: #555; text-align: right; line-height: 1.4; }
          .bill-meta-table { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
          .bill-meta-table td { padding: 8px; vertical-align: top; border: 1px solid #ddd; }
          .section-title { font-size: 11px; font-weight: 800; color: #082854; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
          .item-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .item-table th { background: #082854; color: white; padding: 10px; font-size: 12px; text-transform: uppercase; font-weight: 800; }
          .item-table td { border: 1px solid #ddd; font-size: 12px; }
          .summary-table { width: 40%; margin-left: 60%; border-collapse: collapse; margin-bottom: 30px; }
          .summary-table td { padding: 10px; border: 1px solid #ddd; }
          .grand-total { font-size: 16px; font-weight: 800; color: #8B0000; background: #fdf2f2; }
          .notes-section { border: 1px solid #ffe082; background: #fff8e1; padding: 15px; border-radius: 8px; margin-bottom: 30px; font-size: 11px; }
          .notes-title { font-weight: 800; color: #7c6000; margin-bottom: 6px; text-transform: uppercase; }
          .sign-area { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; }
          .sign-line { border-top: 1px solid #333; width: 200px; text-align: center; font-size: 11px; padding-top: 5px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table class="header-table">
            <tr>
              <td>
                <div class="shop-name">DURGA AGENCIES</div>
                <div style="font-size: 12px; font-weight: 800; color: #8B0000; letter-spacing: 2px; margin-top: 3px;">SIVAKASI PREMIUM CRACKERS</div>
              </td>
              <td class="shop-details">
                <strong>Durga Agencies Wholesale</strong><br/>
                2/553D, Mettamalai, Sivakasi - 626 230<br/>
                Phone: +91 76048 49468, +91 91760 48494<br/>
                Email: durgaagenciessvk@gmail.com
              </td>
            </tr>
          </table>

          <table class="bill-meta-table">
            <tr>
              <td style="width: 50%;">
                <div class="section-title">Invoice To (Customer Detail)</div>
                <strong>Name:</strong> ${bill.customerName}<br/>
                <strong>Phone:</strong> ${bill.phone || 'N/A'}<br/>
                <strong>Delivery Address:</strong><br/>
                ${bill.address || 'N/A'}
              </td>
              <td style="width: 50%;">
                <div class="section-title">Invoice Information</div>
                <strong>Invoice No:</strong> #${bill.billNumber}<br/>
                <strong>Date:</strong> ${new Date(bill.orderDate).toLocaleDateString('en-IN')}<br/>
                <strong>Payment Mode:</strong> UPI / Cash Transfer<br/>
                <strong>Payment Status:</strong> <span style="color:#082854;font-weight:bold;">${bill.paymentStatus || 'Pending Payment'}</span>
              </td>
            </tr>
          </table>

          <table class="item-table">
            <thead>
              <tr>
                <th style="width: 8%; text-align: center;">S.No</th>
                <th style="text-align: left; width: 50%;">Item Description</th>
                <th style="width: 15%; text-align: right;">Price</th>
                <th style="width: 12%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td style="font-weight: bold;">Subtotal</td>
              <td style="text-align: right;">&#8377;${Number(bill.totalAmount).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Delivery Charges</td>
              <td style="text-align: right; color: green; font-weight: bold;">Calculated at Lorry Office</td>
            </tr>
            <tr class="grand-total">
              <td style="font-weight: bold;">Grand Total</td>
              <td style="text-align: right; font-weight: bold;">&#8377;${Number(bill.totalAmount).toFixed(2)}</td>
            </tr>
          </table>

          <div class="notes-section">
            <div class="notes-title">⚠️ Important Purchase Conditions</div>
            <ol style="margin-left: 15px; line-height: 1.6;">
              <li><b>Payment Handover:</b> Parcels will only be handed over to lorry transport/dispatch services after payment is fully confirmed in our account.</li>
              <li><b>Festive Order Cut-off:</b> All online order bookings will close exactly 2 weeks before Diwali.</li>
              <li>Delivery tracking details or transport dispatch receipts will be updated on your order tracker page.</li>
            </ol>
          </div>

          <div class="sign-area">
            <div>
              <p style="font-size: 11px; font-style: italic; color: #666; max-width: 350px;">This is a computer generated invoice and requires no physical signature under normal circumstances.</p>
            </div>
            <div>
              <div class="sign-line" style="margin-top: 30px;">For DURGA AGENCIES</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: 'white', borderRadius: '30px',
        padding: '40px', position: 'relative', boxShadow: '0 50px 150px rgba(0,0,0,0.6)', color: '#333'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px', border: 'none',
          background: '#f5f5f5', padding: '10px', borderRadius: '50%', cursor: 'pointer', lineHeight: 1
        }}><X size={18}/></button>

        {/* Receipt Preview */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#082854', fontWeight: '900', fontSize: '1.5rem', margin: '0 0 4px' }}>DURGA AGENCIES</h2>
          <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#888', margin: 0 }}>METTAMALAI, SIVAKASI</p>
        </div>

        <div style={{ borderTop: '2px dashed #eee', borderBottom: '2px dashed #eee', padding: '10px 0', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
            <span><b>BILL#</b> {bill.billNumber}</span>
            <span><b>DATE:</b> {new Date(bill.orderDate).toLocaleDateString('en-IN')}</span>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>CUSTOMER: {bill.customerName}</div>
        </div>

        <table style={{ width: '100%', fontSize: '0.82rem', marginBottom: '14px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: '5px 0', fontSize: '0.68rem', color: '#888', fontWeight: '900' }}>ITEM</th>
              <th style={{ textAlign: 'center', padding: '5px 0', fontSize: '0.68rem', color: '#888', fontWeight: '900' }}>QTY</th>
              <th style={{ textAlign: 'right', padding: '5px 0', fontSize: '0.68rem', color: '#888', fontWeight: '900' }}>AMT</th>
            </tr>
          </thead>
          <tbody>
            {bill.items && bill.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '6px 0', fontWeight: '600' }}>{item.name}</td>
                <td style={{ padding: '6px 0', textAlign: 'center', color: '#666' }}>x{item.qty}</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '800' }}>₹{(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ background: '#fff8f0', borderRadius: '12px', padding: '12px 16px', border: '1px solid #f0ddd0', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.2rem' }}>
            <span>TOTAL</span>
            <span style={{ color: '#082854' }}>₹{Number(bill.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handlePrint} className="btn-primary" style={{
            flex: 2, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', fontSize: '0.9rem', letterSpacing: '1px'
          }}>
            <Printer size={18}/> PRINT / SAVE PDF
          </button>
          <button onClick={onClose} style={{
            flex: 1, background: '#f5f5f5', border: 'none', borderRadius: '50px',
            fontWeight: '800', color: '#666', cursor: 'pointer'
          }}>CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
