// useInvoiceGenerator.ts
"use client";
import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { formatCurrency } from '@/app/components/currency';

interface ItemData {
    qty: string;
    description: string;
    unitPrice: string;
    amount: string;
    taxName: string;
    taxPercentage: string;
    showTax: boolean;
}

interface InvoiceData {
    from: string;
    billTo: string;
    shipTo: string;
    invoiceNumber: string;
    invoiceDate: string;
    poNumber: string;
    DueDate: string;
    logo: File | null;
    items: ItemData[];
    showTax: boolean;
    dueDate?: string;
}

interface UseInvoiceGeneratorProps {
    invoiceData: InvoiceData;
    signature: File | null;
    termsConditions: string;
    subtotal: number;
    vat: number;
    total: number;
    vatPercentage: number;
    currency: string;
    currencySymbol: string;
}

const useInvoiceGenerator = ({
                                 invoiceData,
                                 signature,
                                 termsConditions,
                                 subtotal,
                                 vat,
                                 total,
                                 vatPercentage,
                                 currency,
                                 currencySymbol,
                             }: UseInvoiceGeneratorProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);
            const { width, height } = page.getSize();

            let yOffset = height - 50;

            const drawMultilineText = (text: string, x: number, y: number) => {
                const lines = text.split("\n");
                lines.forEach((line, index) => {
                    page.drawText(line, {
                        x,
                        y: y - index * 15,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });
                });
            };

            const embedImage = async (file: File) => {
                const arrayBuffer = await fileToArrayBuffer(file);
                const fileType = file.type;
                if (fileType === "image/png") {
                    return pdfDoc.embedPng(arrayBuffer);
                } else if (fileType === "image/jpeg") {
                    return pdfDoc.embedJpg(arrayBuffer);
                } else {
                    throw new Error(
                        "Unsupported image format. Only PNG and JPEG are allowed."
                    );
                }
            };

            // Draw Logo
            if (invoiceData.logo instanceof File) {
                const logoImage = await embedImage(invoiceData.logo);
                page.drawImage(logoImage, {
                    x: width - 165,
                    y: yOffset - 80,
                    width: 100,
                    height: 50,
                });
            }

            // From Section
            page.drawText("From:", {
                x: 50,
                y: yOffset - 50,
                size: 12,
                color: rgb(0, 0, 0),
            });
            drawMultilineText(invoiceData.from, 50, yOffset - 70);

            yOffset -= 180;

            // Invoice Information
            page.drawText("Invoice #:", {
                x: 300,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });
            page.drawText(invoiceData.invoiceNumber, {
                x: 450,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });

            page.drawText("Invoice Date:", {
                x: 300,
                y: yOffset - 20,
                size: 12,
                color: rgb(0, 0, 0),
            });
            page.drawText(invoiceData.invoiceDate, {
                x: 450,
                y: yOffset - 20,
                size: 12,
                color: rgb(0, 0, 0),
            });

            yOffset -= 40;
            page.drawText("Due Date:", {
                x: 300,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });
            page.drawText(invoiceData.DueDate || "N/A", {
                x: 450,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Bill To Section
            page.drawText("Bill To:", {
                x: 50,
                y: yOffset + 40,
                size: 12,
                color: rgb(0, 0, 0),
            });
            drawMultilineText(invoiceData.billTo, 50, yOffset + 20);

            yOffset -= 40;

            const labelWidth = 100;
            const spaceBetween = 20;

            // Conditionally draw "Ship To" if there is input
            if (invoiceData.shipTo && invoiceData.shipTo.trim() !== "") {
                page.drawText("Ship To:", {
                    x: 50,
                    y: yOffset,
                    size: 12,
                    color: rgb(0, 0, 0),
                });
                drawMultilineText(invoiceData.shipTo, 50, yOffset - 20);

                if (invoiceData.poNumber && invoiceData.poNumber.trim() !== "") {
                    // Draw "P.O. #" label
                    page.drawText("P.O. #:", {
                        x: 300,
                        y: yOffset,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });

                    // Draw the actual P.O. number with space
                    page.drawText(invoiceData.poNumber, {
                        x: 400,
                        y: yOffset,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });
                }

                yOffset -= 50;
            }

            // Adjust yOffset for item headers
            yOffset -= 20;

            // Draw item headers
            page.drawText("Qty", {
                x: 50,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });
            page.drawText("Description", {
                x: 100,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });
            page.drawText("Unit Price", {
                x: 300,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });
            page.drawText("Amount", {
                x: 450,
                y: yOffset,
                size: 12,
                color: rgb(0, 0, 0),
            });

            yOffset -= 30;

            const amountX = 450;
            const labelX = 300;

            // Draw each invoice item
            invoiceData.items.forEach((item) => {
                page.drawText(item.qty, {
                    x: 50,
                    y: yOffset,
                    size: 12,
                    color: rgb(0, 0, 0),
                });
                drawMultilineText(item.description, 100, yOffset);
                page.drawText(item.unitPrice, {
                    x: 300,
                    y: yOffset,
                    size: 12,
                    color: rgb(0, 0, 0),
                });
                page.drawText(item.amount, {
                    x: amountX,
                    y: yOffset,
                    size: 12,
                    color: rgb(0, 0, 0),
                });

                yOffset -= 50;
            });

            yOffset -= 20;

            const textSize = 12;

            // Subtotal
            page.drawText(`Subtotal:`, {
                x: labelX,
                y: yOffset,
                size: textSize,
                color: rgb(0, 0, 0),
            });
            page.drawText(`${formatCurrency(subtotal, currencySymbol)}`, {
                x: amountX,
                y: yOffset,
                size: textSize,
                color: rgb(0, 0, 0),
            });
            yOffset -= 40;

            // VAT
            if (vat > 0) {
                page.drawText(`VAT (${vatPercentage}%):`, {
                    x: labelX,
                    y: yOffset,
                    size: textSize,
                    color: rgb(0, 0, 0),
                });
                page.drawText(`${formatCurrency(vat, currencySymbol)}`, {
                    x: amountX,
                    y: yOffset,
                    size: textSize,
                    color: rgb(0, 0, 0),
                });
                yOffset -= 40;
            }

            // Total
            page.drawText(`Total:`, {
                x: labelX,
                y: yOffset,
                size: textSize,
                color: rgb(0, 0, 0),
            });
            page.drawText(`${currencySymbol}${formatCurrency(total, currencySymbol)}`, {
                x: amountX,
                y: yOffset,
                size: textSize,
                color: rgb(0, 0, 0),
            });

            yOffset -= 80;

            // Signature positioning
            const signatureY = yOffset;

            // Draw Signature if it exists
            if (signature instanceof File) {
                const signatureImage = await embedImage(signature);
                page.drawImage(signatureImage, {
                    x: amountX - 100,
                    y: signatureY - 50,
                    width: 100,
                    height: 50,
                });
            }

            yOffset -= 70;

            // Draw Terms and Conditions only if provided
            if (termsConditions) {
                const margin = 50;
                const termsY = yOffset;

                page.drawText("Terms and Conditions:", {
                    x: margin,
                    y: termsY,
                    size: 12,
                    color: rgb(0, 0, 0),
                });
                yOffset = termsY - 20;

                const termsLines = termsConditions.split("\n");
                termsLines.forEach((line, index) => {
                    page.drawText(line, {
                        x: margin,
                        y: yOffset - index * 15,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });
                });
                yOffset -= termsLines.length * 15;
            } else {
                yOffset -= 20;
            }

            // Final yOffset adjustment
            yOffset = Math.min(signatureY - 60, yOffset);

            // Save PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return { generatePDF, isGenerating };
};

export default useInvoiceGenerator;
