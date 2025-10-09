import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Header } from '@/components/header';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Footer } from '@/components/footer';
import Illustration from '@/components/ui/illustration';
import './globals.css';

const robotoSans = Roboto({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tunereveal.vercel.app'),
  title: {
    default: 'TuneReveal: Advanced Music Analysis for YouTube Songs',
    template: '%s | TuneReveal',
  },
  description:
    'TuneReveal analyzes any YouTube song. Get BPM, key, loudness, and more audio insights — perfect for DJs, producers, and music fans.',
  keywords: [
    'TuneReveal',
    'music analysis tool',
    'audio analysis software',
    'YouTube BPM finder',
    'song key detector',
    'music production tools',
    'DJ tools',
    'music theory helper',
    'song analysis',
    'music features',
    'Essentia',
    'song analysis tool',
    'BPM detection',
    'music key detection',
    'song structure analysis',
    'music production software',
    'DJ software',
    'music practice tool',
    'audio feature extraction',
    'music visualization',
  ],
  authors: [{ name: 'Deivit Eduardo', url: 'https://duardodev.vercel.app/' }],
  creator: 'Deivit Eduardo',
  openGraph: {
    title: 'TuneReveal: Advanced Music Analysis for YouTube Songs',
    description:
      'Get instant BPM, key, and detailed audio analysis for any YouTube music video. Essential for DJs, producers, and music lovers.',
    url: 'https://tunereveal.vercel.app',
    siteName: 'TuneReveal',
    images: [
      {
        url: 'https://opengraph.b-cdn.net/production/images/0ecd209b-c31a-45ac-8986-535dd22b8e7f.png?token=cB_fUH1jHB5GdjLIl1gGmZ8r3yvHIUVZtr9SjrEnGII&height=624&width=1200&expires=33288971157',
        alt: 'TuneReveal - YouTube Music Analyzer',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'EfLNkfY4gfYHHxeFHGfvBppyAF3KzlGqcAId37x5QjU',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden scroll-smooth">
      <body
        className={`${robotoSans.className} dark antialiased w-full px-4 mx-auto max-w-[1140px] relative flex flex-col overflow-hidden`}
      >
        <Illustration />
        <Header />
        <Providers>{children}</Providers>
        <Footer />
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
