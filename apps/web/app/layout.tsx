/**
 * @fileoverview Root layout component providing global metadata, fonts, and HTML structure
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'
  ),
  title: 'Alva - Your AI Marketing Director',
  description:
    'Get a personalized marketing plan in minutes, not months. Alva works with you 24/7 to build and execute a strategy tailored to your business.',
  keywords:
    'AI marketing, marketing automation, small business marketing, marketing strategy, AI marketing director',
  authors: [{ name: 'Alva Team' }],
  creator: 'Alva',
  publisher: 'Alva',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alva.com',
    title: 'Alva - Your AI Marketing Director',
    description: 'Get a personalized marketing plan in minutes, not months.',
    siteName: 'Alva',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alva - AI Marketing Director',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alva - Your AI Marketing Director',
    description: 'Get a personalized marketing plan in minutes, not months.',
    images: ['/twitter-image.jpg'],
    creator: '@alva',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffd700" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
