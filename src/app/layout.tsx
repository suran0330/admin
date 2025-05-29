// Instructions: Update the root layout for the admin dashboard with proper metadata and structure

import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "INKEY List Admin Dashboard",
  description: "Comprehensive admin dashboard for managing The INKEY List store - products, orders, analytics, and design management.",
  keywords: "admin, dashboard, ecommerce, product management, analytics, orders, design management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lato.variable} antialiased font-inter`}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
