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

export const metadata: Metadata = {
  metadataBase: new URL('https://yanlamode.com'),
  title: "YANLAMODE HAUTE COUTURE | L'élégance façonnée sur mesure",
  description: "Maison de haute couture et création sur mesure. 11 années de savoir-faire d'exception au service de créations uniques pour hommes et femmes.",
  keywords: [
    "haute couture",
    "couturier sur mesure",
    "couture homme",
    "couture femme",
    "smoking sur mesure",
    "tenue de cérémonie",
    "mode africaine",
    "YANLAMODE Haute Couture"
  ],
  openGraph: {
    title: "YANLAMODE HAUTE COUTURE | L'élégance façonnée sur mesure",
    description: "11 années de savoir-faire au service de créations uniques. Smokings, tenues de cérémonie et pièces sur mesure.",
    images: ['/images/brand/logo.jpg'],
    type: 'website',
  },
  icons: {
    icon: '/images/brand/logo.jpg',
  },
};

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
