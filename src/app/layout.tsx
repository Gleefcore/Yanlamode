import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import '@/styles/globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

import { db } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getSettings();
  
  return {
    metadataBase: new URL('https://yanlamode.vercel.app'),
    title: settings.seo?.metaTitle || `${settings.brandName} | ${settings.tagline}`,
    description: settings.seo?.metaDescription || settings.secondaryTagline,
    keywords: settings.seo?.keywords || [
      "haute couture",
      "couturier sur mesure",
      "couture homme",
      "couture femme",
      "smoking sur mesure",
      "tenue de cérémonie",
      "mode africaine",
      settings.brandName
    ],
    openGraph: {
      title: settings.seo?.metaTitle || `${settings.brandName} | ${settings.tagline}`,
      description: settings.seo?.metaDescription || settings.secondaryTagline,
      images: ['/images/brand/logo.jpg'],
      type: 'website',
    },
    icons: {
      icon: '/images/brand/logo.jpg',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-[#FAF8F5] text-[#111111] antialiased selection:bg-[#C5A880] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
