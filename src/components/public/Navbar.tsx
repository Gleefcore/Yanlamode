'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, ChevronRight } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

import TopAnnouncementBar from '@/components/public/TopAnnouncementBar';

const NAV_LINKS = [
  { name: 'Accueil', href: '/' },
  { name: 'La Maison', href: '/la-maison' },
  { name: 'Collections', href: '/collections' },
  { name: 'Créations', href: '/creations' },
  { name: 'Sur mesure', href: '/sur-mesure' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { path: pathname });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar - Deliveries to Cameroon, Europe, Canada */}
      <TopAnnouncementBar />

      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#E8E2D9]/70 py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
            : 'bg-[#FAF8F5]/90 backdrop-blur-md py-4 border-b border-[#E8E2D9]/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-[#C5A880]/60 shadow-sm group-hover:border-[#C5A880] transition-colors duration-300">
              <Image
                src="/images/brand/logo.jpg"
                alt="YANLAMODE Haute Couture"
                fill
                className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <span className="font-serif-luxe text-lg sm:text-xl tracking-[0.24em] uppercase font-bold text-[#0E0E10] group-hover:text-[#8C6D42] transition-colors">
                YANLAMODE
              </span>
              <span className="block text-[8.5px] uppercase tracking-[0.38em] text-[#C5A880] font-medium">
                Haute Couture
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.26em] transition-all relative py-1 font-medium ${
                    isActive
                      ? 'text-[#0E0E10] font-semibold'
                      : 'text-[#5C564E] hover:text-[#0E0E10]'
                  }`}
                >
                  {link.name}
                  {isActive ? (
                    <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#C5A880]" />
                  ) : (
                    <span className="absolute -bottom-1 left-1/2 right-1/2 h-[1px] bg-[#C5A880] transition-all duration-300 group-hover:left-0 group-hover:right-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button: Commander */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href={generateWhatsAppLink({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2.5 px-6 py-2.5 text-[11px] uppercase tracking-[0.24em] bg-[#0E0E10] hover:bg-[#C5A880] text-[#FFFFFF] hover:text-[#0E0E10] border border-[#0E0E10] hover:border-[#C5A880] transition-all duration-400 font-semibold shadow-sm rounded-none"
              title="Passer une commande ou échanger avec l'atelier"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880] group-hover:bg-[#0E0E10]" />
              <span>COMMANDER</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#111111] hover:text-[#C5A880] focus:outline-none"
            aria-label="Ouvrir le menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#111111]" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E8E2D9] px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between text-sm uppercase tracking-[0.2em] py-2.5 border-b border-[#F2ECE4] ${
                      isActive ? 'text-[#C5A880] font-semibold' : 'text-[#333333]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#C5A880]" />
                  </Link>
                );
              })}
            </nav>
            <div className="pt-3">
              <a
                href={generateWhatsAppLink({ type: 'general' })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleWhatsAppClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#111111] text-[#FAF8F5] border border-[#C5A880] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#C5A880] hover:text-black transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A880]" />
                <span>Commander</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
