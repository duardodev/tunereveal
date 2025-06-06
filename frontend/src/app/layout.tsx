import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Header } from '@/components/header';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import Illustration from '@/components/ui/illustration';
import './globals.css';

const robotoSans = Roboto({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tunereveal.vercel.app'),
  title: 'TuneReveal | Get the BPM, Key and Audio Analysis from Any YouTube Song',
  description:
    'TuneReveal analyze YouTube music videos and reveal musical insights like Key, BPM, and more. Perfect for creators, producers, and music lovers.',
  keywords: [
    'TuneReveal',
    'music analysis',
    'audio analysis',
    'YouTube music analyzer',
    'energy',
    'loudness',
    'BPM detection',
    'key',
    'music features',
    'Essentia',
    'song analysis tool',
  ],
  authors: [{ name: 'Deivit Eduardo', url: 'https://duardodev.vercel.app/' }],
  creator: 'Deivit Eduardo',
  openGraph: {
    siteName: 'TuneReveal',
    title: 'TuneReveal | Get the BPM, Key and Audio Analysis from Any YouTube Song',
    description:
      'TuneReveal analyze YouTube music videos and reveal musical insights like Key, BPM, and more. Perfect for creators, producers, and music lovers.',
    url: 'https://tunereveal.vercel.app',
    images: [
      {
        url: 'https://opengraph.b-cdn.net/production/images/8ecc1286-2864-4462-89ec-26ae5eafef27.png?token=Sw9e9c1jLf_clhsbm4sN1jqU7-C1wu2NMFkMa-D4Mss&height=644&width=1200&expires=33285226025',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${robotoSans.className} dark antialiased w-full px-4 mx-auto max-w-[1140px] relative flex flex-col overflow-hidden`}
      >
        <Illustration />
        <Header />
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
