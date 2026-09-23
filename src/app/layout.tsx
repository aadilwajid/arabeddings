import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARA Beddings | Luxury Home Linen & Bedding - Pakistan',
  description: 'Premium quality bedding, comforters, quilts, and home linen delivered across Pakistan. Cash on Delivery available.',
  keywords: ['bedding', 'linen', 'luxury', 'sheets', 'pillows', 'blankets', 'comforters', 'Pakistan', 'ARA Beddings'],
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
