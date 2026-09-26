import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/contexts/AppContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import MobileOptimization from '@/components/MobileOptimization';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'ARA Beddings | Luxury Home Linen & Bedding - Pakistan',
  description: 'Premium quality bedding, comforters, quilts, and home linen delivered across Pakistan. Cash on Delivery available.',
  keywords: ['bedding', 'linen', 'luxury', 'sheets', 'pillows', 'blankets', 'comforters', 'Pakistan', 'ARA Beddings'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ARA Beddings',
  },
};

export const viewport: Viewport = {
  themeColor: '#C4A265',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#C4A265" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ARA Beddings" />
      </head>
      <body className="bg-[#FDF8F3] text-[#2D2A26] antialiased pb-16 md:pb-0">
        <AppProvider>
          <ThemeProvider>
            {children}
            <ThemeSwitcher />
            <MobileOptimization />
            <MobileBottomNav />
          </ThemeProvider>
        </AppProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
