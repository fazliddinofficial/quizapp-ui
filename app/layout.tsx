"use client";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "../lib/socketContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </SocketProvider>
      </body>
    </html>
  );
}
