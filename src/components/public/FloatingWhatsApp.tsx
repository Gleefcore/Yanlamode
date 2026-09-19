'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  const handleClick = () => {
    trackEvent('whatsapp_click', { path: pathname });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Label Tooltip */}
      <span className="hidden sm:block mr-3 px-3.5 py-1.5 bg-[#FFFFFF] border border-[#C5A880] text-[#111111] text-xs font-semibold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Commander · Atelier Yanlamode
      </span>

      <a
        href={generateWhatsAppLink({ type: 'general' })}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 bg-[#111111] text-[#FFFFFF] rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-[#C5A880] hover:bg-[#C5A880] hover:text-[#111111]"
        aria-label="Contacter la maison sur WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#25D366] rounded-full ring-2 ring-white animate-pulse" />
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </div>
  );
}
