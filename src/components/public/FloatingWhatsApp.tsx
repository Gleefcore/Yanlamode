'use client';

import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  const handleClick = () => {
    trackEvent('whatsapp_click', { path: pathname });
  };

  return (
    <aside aria-label="Conciergerie Atelier" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Luxury Concierge Tooltip */}
      <span className="hidden md:inline-flex items-center gap-2 mr-3 px-4 py-2 bg-[#0E0E10]/95 backdrop-blur-md border border-[#C5A880]/50 text-[#F5F2EB] text-[11px] uppercase tracking-[0.2em] font-medium shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shadow-[0_0_6px_#C5A880]" />
        <span>Conciergerie · Atelier Privé</span>
      </span>

      <a
        href={generateWhatsAppLink({ type: 'general' })}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#0E0E10] text-[#C5A880] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-[#C5A880]/60 hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-[#0E0E10] transition-all duration-400 active:scale-95 group"
        aria-label="Contacter la maison Yanlamode"
      >
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#C5A880] rounded-full ring-2 ring-[#0E0E10] animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#C5A880] rounded-full ring-2 ring-[#0E0E10]" />
        {/* Couture Monogram Icon */}
        <span className="font-serif text-lg font-bold tracking-tighter">YM</span>
      </a>
    </aside>
  );
}
