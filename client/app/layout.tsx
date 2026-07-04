import type { Metadata } from "next";

import { Geist } from "next/font/google";

import "./globals.css";
import AppBackground from "@/components/layout/AppBackground";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {

  title: "Mini Visitor CRM",

  description: "Visitor Management System",

};

export default function RootLayout({
  children,
}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html lang="en">

      <body className={geist.className}>

        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppBackground />

              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>

      </body>

    </html>

  );

}