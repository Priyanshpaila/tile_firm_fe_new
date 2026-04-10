import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { AppChrome } from "@/components/layout/app-chrome";

export const metadata: Metadata = {
  title: "SquareFoot",
  description: "Tiles and interiors frontend starter wired to the provided backend.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppChrome>{children}</AppChrome>
        </AppProviders>
      </body>
    </html>
  );
}