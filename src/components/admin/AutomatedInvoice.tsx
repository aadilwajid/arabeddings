'use client';

import { useState } from 'react';
import { FileText, Download, Mail, Printer } from 'lucide-react';
import { Order } from '@/types';

interface AutomatedInvoiceProps {
  order: Order;
}

export default function AutomatedInvoice({ order }: AutomatedInvoiceProps) {
  const [generating, setGenerating] = useState(false);

  const generateInvoiceHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #2D2A26; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #C4A265; }
    .logo { font-size: 24px; font-weight: bold; color: #2D2A26; }
    .logo span { color: #C4A265; }
    .invoice-title { text-align: right; }
    .invoice-title h2 { margin: 0; color: #2D2A26; }
    .invoice-title p { margin: 5px 0; color: #5C4A32; font-size: 14px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .info-box { background: #FDF8F3; padding: 15px; border-radius: 8px; }
    .info-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #5C4A32; text-transform: uppercase; }
    .info-box p { margin: 5px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #F5EDE4; padding: 12px; text-align: left; font-size: 14px; color: #5C4A32; }
    td { padding: 12px; border-bottom: 1px solid #E8DFD5; font-size: 14px; }
    .totals { text-align: right; margin-bottom: 30px; }
    .totals-row { display: flex; justify-content: flex-end; gap: 20px; margin: 8px 0; }
    .totals-row.total { font-size: 18px; font-weight: bold; border-top: 2px solid #2D2A26; padding-top: 10px; margin-top: 10px; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #E8DFD5; color: #A09080; font-size: 12px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">ARA <span>BEDDINGS</span></div>
        <p style="margin: 5px 0; color: #5C4A32; font-size: 14px;">Luxury Home Linen & Bedding</p>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <p><strong>Order #:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h3>Bill To</h3>
        <p><strong>${order.customer.name}</strong></p>
        <p>${order.customer.email}</p>
        <p>${order.customer.phone}</p>
        <p>${order.customer.address}</p>
        <p>${order.customer.city}, ${order.customer.postalCode}</p>
      </div>
      <div class="info-box">
        <h3>Payment Info</h3>
        <p><strong>Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        ${order.paymentProof ? `<p><strong>Payment Proof:</strong> ${order.paymentProof}</p>` : ''}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Details</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td><strong>${item.productName}</strong></td>
            <td>${item.size} - ${item.type}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">Rs ${item.price.toLocaleString()}</td>
            <td style="text-align: right;">Rs ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span>Rs ${order.subtotal.toLocaleString()}</span>
      </div>
      <div class="totals-row">
        <span>Shipping:</span>
        <span>Rs ${order.shipping.toLocaleString()}</span>
      </div>
      <div class="totals-row total">
        <span>Total:</span>
        <span>Rs ${order.total.toLocaleString()}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for shopping with ARA Beddings!</p>
      <p>For any queries, contact us at 03160143039</p>
      <p>© 2026 ARA Beddings. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  };

  const handleDownload = () => {
    setGenerating(true);
    const html = generateInvoiceHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.orderNumber}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    setGenerating(false);
  };

  const handlePrint = () => {
    const html = generateInvoiceHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const handleEmail = () => {
    const subject = `Invoice - Order #${order.orderNumber}`;
    const body = `Dear ${order.customer.name},\n\nPlease find your invoice for Order #${order.orderNumber} attached.\n\nOrder Total: Rs ${order.total.toLocaleString()}\n\nThank you for shopping with ARA Beddings!\n\nBest regards,\nARA Beddings Team\n03160143039`;
    window.location.href = `mailto:${order.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={20} className="text-[#C4A265]" />
        <h3 className="text-lg font-medium text-[#2D2A26]">Automated Invoice</h3>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleDownload}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] disabled:opacity-50 font-medium"
        >
          <Download size={16} />
          {generating ? 'Generating...' : 'Download Invoice (HTML)'}
        </button>

        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2D2A26] text-white rounded-lg hover:bg-[#3D3A36] font-medium"
        >
          <Printer size={16} />
          Print Invoice
        </button>

        <button
          onClick={handleEmail}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#E8DFD5] text-[#5C4A32] rounded-lg hover:bg-[#F5EDE4] font-medium"
        >
          <Mail size={16} />
          Email to Customer
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-[#E8DFD5]">
        <p className="text-xs text-[#A09080]">
          Invoice includes: Order details, customer information, itemized list, totals, and payment information.
        </p>
      </div>
    </div>
  );
}
