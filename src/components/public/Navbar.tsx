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
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8E2D9] py-3 shadow-sm'
            : 'bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white p-1 border border-[#C5A880] shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/brand/logo.jpg"
                alt="YANLAMODE Haute Couture"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-serif-luxe text-lg sm:text-xl tracking-[0.2em] uppercase font-bold text-[#111111] group-hover:text-[#C5A880] transition-colors">
                YANLAMODE
              </span>
              <span className="block text-[9px] uppercase tracking-[0.35em] text-[#C5A880] font-semibold">
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
                  className={`text-xs uppercase tracking-[0.22em] transition-all relative py-1.5 font-medium ${
                    isActive
                      ? 'text-[#C5A880] font-semibold'
                      : 'text-[#4A4641] hover:text-[#111111]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A880]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button: Commander (au lieu de WhatsApp) */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href={generateWhatsAppLink({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.2em] bg-[#111111] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#111111] border border-[#C5A880]/50 hover:border-[#C5A880] transition-all duration-300 rounded-sm font-semibold shadow-sm"
              title="Passer une commande ou échanger avec l'atelier"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C5A880] hover:text-[#111111] fill-current" />
              <span>Commander</span>
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
