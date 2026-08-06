import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import SideNav from "../components/SideNav";
import CloudSync from "../components/CloudSync";
import ThemeProvider from "../components/ThemeProvider";
import LayoutClient from "./LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Limitr",
  description: "Modern Capital Management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <CloudSync />
          <LayoutClient>
            <div className="flex min-h-screen bg-[var(--bg-primary)]">
              <SideNav />
              <div className="flex-1 w-full mx-auto max-w-md md:max-w-4xl relative sm:border-x sm:border-[var(--border-primary)] sm:shadow-2xl md:border-none md:shadow-none bg-[var(--bg-primary)] min-h-screen pb-[64px] md:pb-0">
                <main className="px-5 pt-8 pb-10 md:p-8">
                  {children}
                </main>
              </div>
              <BottomNav />
            </div>
          </LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
