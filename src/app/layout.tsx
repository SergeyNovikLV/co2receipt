import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CO₂ Receipt",
  description: "Measure, verify, and share environmental impact in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-[100svh] bg-white flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
            <footer className="border-t mt-auto">
              <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-6 text-xs text-muted-foreground flex items-center justify-between">
                <span>© {new Date().getFullYear()} CO₂ Receipt</span>
                                     <div className="text-[11px] font-medium">
                       Factor Set v2025.1
                     </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
