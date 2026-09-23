import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARA BEDDINGS | Luxury Home Linen & Bedding',
  description: 'Discover our curated collection of premium bedding and home linen, crafted from the world\'s finest natural fibers.',
  keywords: ['bedding', 'linen', 'luxury', 'sheets', 'pillows', 'blankets', 'ARA BEDDINGS'],
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
      </head>
      <body className="bg-[#FDF8F3] text-[#2D2A26] antialiased">
        {children}
      </body>
    </html>
  );
}
