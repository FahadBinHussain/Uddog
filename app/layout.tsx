import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: "UdDog - Fundraising Platform",
  description:
    "A comprehensive fundraising platform for campaigns, donations, and impact stories",
  keywords: [
    "fundraising",
    "donations",
    "campaigns",
    "charity",
    "crowdfunding",
  ],
  authors: [{ name: "UdDog Team" }],
  creator: "UdDog",
  publisher: "UdDog",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "UdDog - Fundraising Platform",
    description:
      "A comprehensive fundraising platform for campaigns, donations, and impact stories",
    siteName: "UdDog",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UdDog Fundraising Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UdDog - Fundraising Platform",
    description:
      "A comprehensive fundraising platform for campaigns, donations, and impact stories",
    images: ["/og-image.jpg"],
    creator: "@uddog",
  },
};

// Dedicated exports for viewport and themeColor
export const viewport = "width=device-width, initial-scale=1, maximum-scale=1";
export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#000000" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UdDog" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* Skip to main content link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>

            {/* Navigation */}
            <Navigation />

            {/* Main content */}
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast notifications */}
            <Toaster />

            {/* Offline indicator */}
            <div
              id="offline-indicator"
              className="hidden fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
            >
              You are currently offline
            </div>

            {/* Loading overlay for page transitions */}
            <div
              id="page-loading"
              className="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
                <div className="spinner"></div>
                <span className="text-sm font-medium">Loading...</span>
              </div>
            </div>
          </div>

          {/* Background decorations */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-green-100 to-blue-100 opacity-20 blur-3xl"></div>
          </div>
        </Providers>

        {/* Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered:', reg))
                    .catch(err => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />

        {/* Online/Offline Detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateOnlineStatus() {
                const indicator = document.getElementById('offline-indicator');
                if (navigator.onLine) indicator.classList.add('hidden');
                else indicator.classList.remove('hidden');
              }
              window.addEventListener('online', updateOnlineStatus);
              window.addEventListener('offline', updateOnlineStatus);
              updateOnlineStatus();
            `,
          }}
        />

        {/* Performance Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  if (perfData && perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                    console.warn('Page load time is slow:', perfData.loadEventEnd - perfData.loadEventStart);
                  }
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
