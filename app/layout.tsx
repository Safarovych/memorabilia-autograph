import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../components/LanguageProvider';

const siteUrl = 'https://memorabilia-autograph.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Memorabilia Autograph — Football Heritage',
    template: '%s | Memorabilia Autograph',
  },
  description: 'Premium football jerseys, signed memorabilia, collector pieces and live auctions.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Memorabilia Autograph — Football Heritage',
    description: 'Premium football jerseys, signed memorabilia, collector pieces and live auctions.',
    siteName: 'Memorabilia Autograph',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memorabilia Autograph — Football Heritage',
    description: 'Premium football jerseys, signed memorabilia, collector pieces and live auctions.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>;
}
