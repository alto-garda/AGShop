import type { Metadata, Viewport } from "next";
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
  title: "AG Shop",
  description: "Magazzino Alto Garda",
  applicationName: "AG Shop",
  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    title: "AG Shop",
    statusBarStyle: "black-translucent",
  },

  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1668E8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${geist.className} min-h-screen overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-300">

            <div className="shrink-0">
              <Header />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <PageTransition>
                <main className="mx-auto w-full max-w-md px-5 pt-4 pb-24">
                  {children}
                </main>
              </PageTransition>
            </div>

            <div className="shrink-0">
              <Footer />
            </div>

            <Toaster richColors position="top-center" />

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
