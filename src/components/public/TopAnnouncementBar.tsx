'use client';

import Link from 'next/link';

export default function TopAnnouncementBar() {
  return (
    <div className="bg-[#0E0E10] text-[#E8E2D8] text-[10px] sm:text-[11px] py-2 px-4 border-b border-[#C5A880]/20 tracking-[0.25em] uppercase font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880] shadow-[0_0_8px_#C5A880]" />
          <span className="text-[#F5F2EB] font-light">
            Livraison Partout au Cameroun · Europe · Canada
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-[10px] text-[#A69E92] tracking-[0.2em]">
          <span>Maison Fondée il y a 11 ans</span>
          <span className="text-[#C5A880]/30">•</span>
          <Link
            href="/sur-mesure"
            className="text-[#C5A880] hover:text-[#FFFFFF] transition-colors luxury-underline"
          >
            Atelier Privé Sur-Mesure
          </Link>
        </div>
      </div>
    </div>
  );
}
