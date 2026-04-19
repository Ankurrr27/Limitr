import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import CloudSync from "../components/CloudSync";
import ThemeProvider from "../components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Limitr - Control Your Spending",
  description: "A professional spending companion for intentional capital management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--bg-primary)]`}>
        <ThemeProvider>
          <CloudSync />
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col relative bg-[var(--bg-primary)] sm:border-x sm:border-[var(--border-primary)] sm:shadow-2xl">
            <main className="flex-1 px-4 pb-44 pt-10">
              {children}
            </main>
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
