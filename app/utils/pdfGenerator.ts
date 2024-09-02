import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

interface Item {
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  username: string;
  company: string;
  email: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: Item[];
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
}

interface InvoicePDFProps {
  invoiceData: InvoiceData;
}

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 16, marginBottom: 10 },
  text: { fontSize: 12 },
});

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Invoice #{invoiceData.invoiceNumber}</Text>
        <Text>Date: {invoiceData.date}</Text>
        <Text>Due Date: {invoiceData.dueDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>From:</Text>
        <Text>{invoiceData.username}</Text>
        <Text>{invoiceData.company}</Text>
        <Text>{invoiceData.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Bill To:</Text>
        <Text>{invoiceData.clientName}</Text>
        <Text>{invoiceData.clientEmail}</Text>
        <Text>{invoiceData.clientAddress}</Text>
      </View>

      {/* Render Items */}
      {invoiceData.items.map((item, index) => (
        <View key={index} style={styles.section}>
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Rate: {item.rate.toFixed(2)}</Text>
          <Text>Amount: {item.amount.toFixed(2)}</Text>
        </View>
      ))}

      {/* Subtotal, Tax, Discount, etc. */}
      <View style={styles.section}>
        <Text>Subtotal: {invoiceData.subtotal.toFixed(2)}</Text>
        <Text>Tax: {invoiceData.tax}%</Text>
        <Text>Discount: {invoiceData.discount.toFixed(2)}</Text>
        <Text>Shipping: {invoiceData.shipping.toFixed(2)}</Text>
        <Text>Total: {invoiceData.total.toFixed(2)}</Text>
        <Text>Amount Paid: {invoiceData.amountPaid.toFixed(2)}</Text>
        <Text>Balance Due: {invoiceData.balanceDue.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
