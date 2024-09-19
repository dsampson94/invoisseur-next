import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define the structure of the invoice data
interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  username: string;
  email: string;
  company: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  companyAddress: string;
  companyContact: string;
  items: Array<{ name: string; amount: number; description: string }>;
  total: number;
  paymentDueDate: string;
  lateFee: number;
  termsConditions: string;
  taxRate: number;
  totalTax: number;
  signature?: string;  // Optional signature data URL
}

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: '40px',
    backgroundColor: '#ffffff'
  },
  header: {
    borderBottom: '2px solid #000000',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    color: '#666666'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5px'
  },
  total: {
    borderTop: '2px solid #000000',
    paddingTop: '10px',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  section: {
    marginBottom: '15px'
  },
  bold: {
    fontWeight: 'bold'
  },
  signature: {
    marginTop: '20px',
    borderTop: '1px solid #000000',
    paddingTop: '10px',
  }
});

// Functional component to generate a PDF for an invoice
const InvoicePDF: React.FC<{ invoiceData: InvoiceData }> = ({ invoiceData }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoice</Text>
        <Text>Invoice Number: {invoiceData.invoiceNumber}</Text>
        <Text>Date: {invoiceData.date}</Text>
        <Text>Due Date: {invoiceData.dueDate}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Client Information</Text>
        <Text>Name: {invoiceData.clientName}</Text>
        <Text>Address: {invoiceData.clientAddress}</Text>
        <Text>Email: {invoiceData.clientEmail}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Company Information</Text>
        <Text>Name: {invoiceData.company}</Text>
        <Text>Address: {invoiceData.companyAddress}</Text>
        <Text>Contact: {invoiceData.companyContact}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Payment Terms</Text>
        <Text>Payment Due Date: {invoiceData.paymentDueDate}</Text>
        <Text>Late Fee: ${invoiceData.lateFee.toFixed(2)}</Text>
        <Text>Terms and Conditions: {invoiceData.termsConditions}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Tax Calculation</Text>
        <Text>Tax Rate: {invoiceData.taxRate}%</Text>
        <Text>Total Tax: ${invoiceData.totalTax.toFixed(2)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Invoice Items</Text>
        {invoiceData.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item.name}</Text>
            <Text>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.total}>
        <Text>Total:</Text>
        <Text>${invoiceData.total.toFixed(2)}</Text>
      </View>
      {invoiceData.signature && (
        <View style={styles.signature}>
          <Text>Signature:</Text>
          <Image src={invoiceData.signature} style={{ width: 200, height: 100 }} />
        </View>
      )}
    </Page>
  </Document>
);

export default InvoicePDF;
