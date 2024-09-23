import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoisseur Free Invoice Maker",
  description: "Invoisseur Free Invoice Maker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
        {/* Google AdSense Code */ }
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5775380070471697"
            crossOrigin="anonymous"
        ></script>
        <title>Invoisseur Free Invoice Maker</title>
      </head>
      <body className={ inter.className }>{ children }</body>
      </html>
  );
}
