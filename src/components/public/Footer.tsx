import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#D8CEBE] pt-16 pb-12 border-t border-[#C5A880]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Manifesto */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-1 border border-[#C5A880]">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="YANLAMODE Haute Couture"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif-luxe text-base tracking-[0.2em] uppercase font-bold text-[#FFFFFF]">
                  YANLAMODE
                </span>
                <span className="block text-[8px] uppercase tracking-[0.35em] text-[#C5A880] font-medium">
                  Haute Couture
                </span>
              </div>
            </div>
            <p className="text-xs text-[#9E9892] leading-relaxed">
              L’élégance façonnée sur mesure. 11 années de savoir-faire artisanal et d'exigence pour sublimer votre allure à travers des silhouettes uniques.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#FFFFFF] font-semibold mb-4 border-b border-[#262626] pb-2">
              La Maison
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/la-maison" className="text-[#B3AAA0] hover:text-[#C5A880] transition-colors">
                  La Maison & Savoir-faire
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-[#B3AAA0] hover:text-[#C5A880] transition-colors">
                  Nos Collections
                </Link>
              </li>
              <li>
                <Link href="/creations" className="text-[#B3AAA0] hover:text-[#C5A880] transition-colors">
                  Catalogue des Créations
                </Link>
              </li>
              <li>
                <Link href="/sur-mesure" className="text-[#B3AAA0] hover:text-[#C5A880] transition-colors">
                  Atelier Sur Mesure
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="text-[#B3AAA0] hover:text-[#C5A880] transition-colors">
                  Lookbook Éditorial
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#B3AAA0] hover:text-[#C5A880] transition-colors">
                  Contact & Rendez-vous
                </Link>
              </li>
            </ul>
          </div>

          {/* Horaires & Coordonnées */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#FFFFFF] font-semibold mb-4 border-b border-[#262626] pb-2">
              Atelier & Expéditions
            </h4>
            <div className="space-y-2 text-xs text-[#9E9892]">
              <p className="text-[#FFFFFF] font-medium">Réception sur rendez-vous privé</p>
              <p>Lundi - Samedi : 09h00 — 19h00</p>
              <p className="text-[#E5DFD7] text-[11px] leading-relaxed">
                <span className="text-[#C5A880] font-semibold">Livraisons d'exception :</span> Partout au Cameroun (Douala, Yaoundé...), Europe &amp; Canada
              </p>
              <p className="text-[#C5A880] pt-2 font-mono text-[11px] font-medium">
                WhatsApp : +237 6 91 87 00 00
              </p>
              <p className="text-[#9E9892] text-[11px] font-mono">
                Atelier : +237 6 97 25 14 25
              </p>
              <p className="text-[#C5A880] text-[11px] font-mono">contact@yanlamode.com</p>
            </div>
          </div>

          {/* Réseaux & Commandes directes */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#FFFFFF] font-semibold mb-4 border-b border-[#262626] pb-2">
              Réseaux Sociaux
            </h4>
            <p className="text-xs text-[#9E9892] mb-4">
              Suivez nos créations exclusives et coulisses d’atelier.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#333333] flex items-center justify-center text-[#B3AAA0] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#333333] flex items-center justify-center text-[#B3AAA0] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/237691870000"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880] hover:bg-[#C5A880] hover:text-black transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#222222] pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#737373] gap-4">
          <p>© {new Date().getFullYear()} YANLAMODE Haute Couture — Tous droits réservés.</p>
          <div className="flex items-center space-x-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions Légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-[#737373] hover:text-[#C5A880] transition-colors"
              title="Espace Administrateur"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administration</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
