import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0C] text-[#D8CEBE] pt-20 pb-12 border-t border-[#C5A880]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Manifesto */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-[#C5A880]/70">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="YANLAMODE Haute Couture"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif-luxe text-base tracking-[0.24em] uppercase font-bold text-[#FFFFFF]">
                  YANLAMODE
                </span>
                <span className="block text-[8.5px] uppercase tracking-[0.38em] text-[#C5A880] font-medium">
                  Haute Couture
                </span>
              </div>
            </div>
            <p className="text-[11.5px] text-[#8C857B] leading-relaxed font-light">
              L’élégance façonnée sur mesure. 11 années de savoir-faire artisanal et de rigueur pour sublimer votre prestance à travers des pièces intemporelles.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10.5px] uppercase tracking-[0.28em] text-[#FFFFFF] font-semibold mb-5 pb-2 border-b border-white/10">
              La Maison
            </h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-[0.16em]">
              <li>
                <Link href="/la-maison" className="text-[#A39A8E] hover:text-[#C5A880] transition-colors">
                  La Maison &amp; Savoir-faire
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-[#A39A8E] hover:text-[#C5A880] transition-colors">
                  Nos Collections
                </Link>
              </li>
              <li>
                <Link href="/creations" className="text-[#A39A8E] hover:text-[#C5A880] transition-colors">
                  Catalogue des Créations
                </Link>
              </li>
              <li>
                <Link href="/sur-mesure" className="text-[#A39A8E] hover:text-[#C5A880] transition-colors">
                  Atelier Sur Mesure
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="text-[#A39A8E] hover:text-[#C5A880] transition-colors">
                  Lookbook Éditorial
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#A39A8E] hover:text-[#C5A880] transition-colors">
                  Contact &amp; Rendez-vous
                </Link>
              </li>
            </ul>
          </div>

          {/* Horaires & Coordonnées */}
          <div>
            <h4 className="text-[10.5px] uppercase tracking-[0.28em] text-[#FFFFFF] font-semibold mb-5 pb-2 border-b border-white/10">
              Atelier &amp; Expéditions
            </h4>
            <div className="space-y-2.5 text-xs text-[#8C857B]">
              <p className="text-[#FFFFFF] font-medium text-[11px] tracking-wide">Réception sur rendez-vous privé</p>
              <p className="text-[11px]">Lundi - Samedi : 09h00 — 19h00</p>
              <p className="text-[#D8CEBE] text-[11px] leading-relaxed pt-1">
                <span className="text-[#C5A880] font-medium">Expéditions :</span> Partout au Cameroun (Douala, Yaoundé...), Europe &amp; Canada
              </p>
              <div className="pt-2 space-y-1">
                <p className="text-[#C5A880] font-mono text-[11px]">
                  WhatsApp : +237 6 91 87 00 00
                </p>
                <p className="text-[#A39A8E] text-[10.5px] font-mono">
                  Atelier : +237 6 97 25 14 25
                </p>
                <p className="text-[#C5A880] text-[11px] font-mono">contact@yanlamode.com</p>
              </div>
            </div>
          </div>

          {/* Réseaux & Commandes directes */}
          <div>
            <h4 className="text-[10.5px] uppercase tracking-[0.28em] text-[#FFFFFF] font-semibold mb-5 pb-2 border-b border-white/10">
              Réseaux Sociaux
            </h4>
            <p className="text-xs text-[#8C857B] mb-5 font-light">
              Suivez nos créations exclusives et coulisses d’atelier.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#A39A8E] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#A39A8E] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/237691870000"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#C5A880]/60 flex items-center justify-center text-[#C5A880] hover:bg-[#C5A880] hover:text-black transition-colors"
                aria-label="WhatsApp"
              >
                <span className="font-serif font-bold text-xs">YM</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10.5px] text-[#6E685F] gap-4">
          <p>© {new Date().getFullYear()} YANLAMODE Haute Couture — Tous droits réservés.</p>
          <div className="flex items-center space-x-6 uppercase tracking-wider">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions Légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-[#6E685F] hover:text-[#C5A880] transition-colors"
              title="Espace Administrateur"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
