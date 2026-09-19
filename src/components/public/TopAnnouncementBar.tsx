'use client';

import Link from 'next/link';
import { Globe2 } from 'lucide-react';

export default function TopAnnouncementBar() {
  return (
    <div className="bg-[#111111] text-[#E5DFD7] text-[10px] sm:text-[11px] py-2 px-4 border-b border-[#C5A880]/30 tracking-[0.18em] uppercase font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
          <span className="text-[#FAF8F5]">
            Livraison Partout au Cameroun, en Europe & au Canada
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[#A8A095]">
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3 h-3 text-[#C5A880]" />
            <span>Expéditions Sécurisées</span>
          </span>
          <span className="text-[#C5A880]/40">•</span>
          <Link
            href="/sur-mesure"
            className="text-[#C5A880] hover:text-[#FFFFFF] transition-colors underline underline-offset-2"
          >
            Commander sur mesure
          </Link>
        </div>
      </div>
    </div>
  );
}
