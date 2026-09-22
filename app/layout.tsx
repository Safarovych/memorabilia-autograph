import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../components/LanguageProvider';
import { CartProvider } from '../components/CartProvider';

export const siteUrl = 'https://memorabilia-autograph.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Memorabilia Autograph — Sports Memorabilia & Signed Collectibles',
    template: '%s | Memorabilia Autograph',
  },
  description: 'Discover authentic sports memorabilia, signed football shirts, boots, balls and collector pieces from football and other sports.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Memorabilia Autograph — Sports Memorabilia & Signed Collectibles',
    description: 'Authentic sports memorabilia, signed jerseys, boots, balls and collector pieces.',
    siteName: 'Memorabilia Autograph',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memorabilia Autograph — Sports Memorabilia & Signed Collectibles',
    description: 'Authentic sports memorabilia, signed jerseys, boots, balls and collector pieces.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><LanguageProvider><CartProvider>{children}</CartProvider></LanguageProvider></body></html>;
}
