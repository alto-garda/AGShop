import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGShop",
  description: "Gestionale ASD Alto Garda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${geist.className} bg-[#F6F8FC]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Header />

          <PageTransition>
            <main className="mx-auto max-w-md px-5 pt-5 pb-24">
              {children}
            </main>
          </PageTransition>

          <Footer />

          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}