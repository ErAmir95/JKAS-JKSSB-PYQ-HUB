import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://jkpyqhub.vercel.app'),
  title: {
    default: 'JK PYQ Hub — JKAS & JKSSB Previous Year Questions',
    template: '%s | JK PYQ Hub',
  },
  description: 'The most comprehensive collection of Previous Year Question Papers for JKAS (Prelims, Mains, Optional) and JKSSB exams. Free PDF download for all subjects and years.',
  keywords: [
    'JKAS PYQ', 'JKSSB PYQ', 'JKAS Previous Year Questions',
    'JKSSB Previous Year Papers', 'JKAS Prelims', 'JKAS Mains',
    'JKPSI PYQ', 'Naib Tehsildar PYQ', 'Patwari PYQ', 'JK exams',
    'Jammu Kashmir Civil Services', 'KAS exam papers',
  ],
  authors: [{ name: 'JK PYQ Hub' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://jkpyqhub.vercel.app',
    siteName: 'JK PYQ Hub',
    title: 'JK PYQ Hub — JKAS & JKSSB Previous Year Questions',
    description: 'Free PDF download of all JKAS and JKSSB previous year question papers.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JK PYQ Hub',
    description: 'Free JKAS & JKSSB Previous Year Question Papers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111225',
              color: '#fff',
              border: '1px solid #1e2035',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#5a63f5', secondary: '#fff' } },
            error: { iconTheme: { primary: '#fb7185', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
