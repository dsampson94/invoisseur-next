import React from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatCurrency } from '../../utils/currency';

// Custom fonts (if needed)
// import { Font } from '@react-pdf/renderer';
// Font.register({
//   family: 'Open Sans',
//   src: 'path_to_open_sans.ttf',
// });

// Define new styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica', // Consider using a more modern font if possible
        lineHeight: 1.5,
        color: '#333', // Darker text color for better readability
    },
    header: {
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 50,
        marginBottom: 10,
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#4f46e5',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 20,
        textAlign: 'right',
    },
    fromToContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fromSection: {
        width: '45%',
    },
    toSection: {
        width: '45%',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 5,
        color: '#4f46e5',
        textTransform: 'uppercase',
    },
    field: {
        marginBottom: 3,
        fontSize: 10,
    },
    table: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 5,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#4f46e5',
        color: '#fff',
        fontWeight: 'bold',
    },
    tableColHeader: {
        padding: 8,
        fontSize: 10,
    },
    tableCol: {
        padding: 8,
        fontSize: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    totalsContainer: {
        marginTop: 10,
        alignSelf: 'flex-end',
        width: '50%',
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    totalsLabel: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    totalsValue: {
        fontSize: 10,
    },
    bankingDetails: {
        marginTop: 20,
    },
    bankField: {
        marginBottom: 3,
        fontSize: 10,
    },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 9,
        color: '#9ca3af',
    },
});

interface ItemData {
    hours?: string;
    description?: string;
    hourlyRate?: string;
    amount?: string;
}

interface InvoiceData {
    from: {
        name?: string;
        physicalAddress?: string;
        idNumber?: string;
        tel?: string;
        cell?: string;
        email?: string;
        taxNo?: string;
    };
    invoiceDate?: string;
    invoiceNumber?: string;
    logo?: string | null;
    to: {
        name?: string;
        vatRegNo?: string;
        coRegNo?: string;
        postalAddress?: string;
        tel?: string;
        fax?: string;
    };
    items: ItemData[];
    subtotal?: number;
    total?: number;
    bankDetails: {
        accountHolder?: string;
        bank?: string;
        accountNumber?: string;
        branchNumber?: string;
        accountType?: string;
    };
    termsConditions?: string;
}

interface InvoiceDocumentProps {
    invoiceData: InvoiceData;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoiceData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    {invoiceData.logo && (
                        <Image src={invoiceData.logo} style={styles.logo} />
                    )}
                    <Text style={styles.invoiceTitle}>INVOICE {invoiceData.invoiceNumber || ''}</Text>
                    {/* Invoice Info */}
                    <View style={styles.section}>
                        <Text style={styles.field}>Invoice Date: {invoiceData.invoiceDate || ''}</Text>
                    </View>
                </View>

                {/* FROM and TO Sections */}
                <View style={styles.fromToContainer}>
                    {/* FROM Section */}
                    <View style={styles.fromSection}>
                        <Text style={styles.sectionTitle}>From</Text>
                        <Text style={styles.field}>Name: {invoiceData.from.name || ''}</Text>
                        <Text style={styles.field}>Address: {invoiceData.from.physicalAddress || ''}</Text>
                        <Text style={styles.field}>Cell: {invoiceData.from.cell || ''}</Text>
                        <Text style={styles.field}>Email: {invoiceData.from.email || ''}</Text>
                        <Text style={styles.field}>Tax No: {invoiceData.from.taxNo || ''}</Text>
                    </View>

                    {/* TO Section */}
                    <View style={styles.toSection}>
                        <Text style={styles.sectionTitle}>Bill To</Text>
                        <Text style={styles.field}>Name:{invoiceData.to.name || ''}</Text>
                        <Text style={styles.field}>Address: {invoiceData.to.postalAddress || ''}</Text>
                        <Text style={styles.field}>Cell: {invoiceData.to.tel || ''}</Text>
                        <Text style={styles.field}>VAT Reg No: {invoiceData.to.vatRegNo || ''}</Text>
                        <Text style={styles.field}>CO Reg No: {invoiceData.to.coRegNo || ''}</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[{ width: '15%' }, styles.tableColHeader]}>Hours</Text>
                        <Text style={[{ width: '55%' }, styles.tableColHeader]}>Description</Text>
                        <Text style={[{ width: '15%', textAlign: 'right' }, styles.tableColHeader]}>Rate</Text>
                        <Text style={[{ width: '15%', textAlign: 'right' }, styles.tableColHeader]}>Amount</Text>
                    </View>
                    {/* Table Rows */}
                    {invoiceData.items.length > 0 ? (
                        invoiceData.items.map((item, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={[{ width: '15%' }, styles.tableCol]}>{item.hours || ''}</Text>
                                <Text style={[{ width: '55%' }, styles.tableCol]}>{item.description || ''}</Text>
                                <Text style={[{ width: '15%', textAlign: 'right' }, styles.tableCol]}>
                                    {item.hourlyRate ? formatCurrency(parseFloat(item.hourlyRate), 'R') : ''}
                                </Text>
                                <Text style={[{ width: '15%', textAlign: 'right' }, styles.tableCol]}>
                                    {item.amount ? formatCurrency(parseFloat(item.amount), 'R') : ''}
                                </Text>
                            </View>
                        ))
                    ) : (
                        // If no items, display a placeholder row
                        <View style={styles.tableRow}>
                            <Text style={[{ width: '100%', textAlign: 'center', padding: 8 }]}>
                                No items to display
                            </Text>
                        </View>
                    )}
                </View>

                {/* Totals */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Subtotal:</Text>
                        <Text style={styles.totalsValue}>
                            {invoiceData.subtotal !== undefined ? formatCurrency(invoiceData.subtotal, 'R') : ''}
                        </Text>
                    </View>
                    {/* If there are taxes or additional charges, include them here */}
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Total:</Text>
                        <Text style={styles.totalsValue}>
                            {invoiceData.total !== undefined ? formatCurrency(invoiceData.total, 'R') : ''}
                        </Text>
                    </View>
                </View>

                {/* Banking Details */}
                <View style={styles.bankingDetails}>
                    <Text style={styles.sectionTitle}>Banking Details</Text>
                    <Text style={styles.bankField}>
                        Account Holder: {invoiceData.bankDetails.accountHolder || ''}
                    </Text>
                    <Text style={styles.bankField}>Bank: {invoiceData.bankDetails.bank || ''}</Text>
                    <Text style={styles.bankField}>
                        Account Number: {invoiceData.bankDetails.accountNumber || ''}
                    </Text>
                    <Text style={styles.bankField}>
                        Branch Number: {invoiceData.bankDetails.branchNumber || ''}
                    </Text>
                    <Text style={styles.bankField}>
                        Type of Account: {invoiceData.bankDetails.accountType || ''}
                    </Text>
                </View>

                {/* Terms and Conditions */}
                {invoiceData.termsConditions && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                        <Text style={styles.field}>{invoiceData.termsConditions}</Text>
                    </View>
                )}

                {/* Footer */}
                <Text style={styles.footer}>
                    Thank you for your business!
                </Text>
            </Page>
        </Document>
    );
};

export default InvoiceDocument;
