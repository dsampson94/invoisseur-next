import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';

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
  items: Array<{ name: string; amount: number }>;
  total: number;
}

export const generatePDFLink = (invoiceData: InvoiceData) => (
  <PDFDownloadLink
    document={<InvoicePDF invoiceData={invoiceData} />}
    fileName={`invoice_${invoiceData.invoiceNumber}.pdf`}
  >
    {({ loading }) => (loading ? 'Generating PDF...' : 'Download Invoice PDF')}
  </PDFDownloadLink>
);
