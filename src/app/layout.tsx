import type { Metadata } from 'next';
import '@/styles/globals.css';

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
    <html lang="fr">
      <body className="min-h-screen bg-[#0A0A0A] text-[#FBF9F5] antialiased">
        {children}
      </body>
    </html>
  );
}
