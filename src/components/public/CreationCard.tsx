'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { Creation } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

interface CreationCardProps {
  creation: Creation;
}

export default function CreationCard({ creation }: CreationCardProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('whatsapp_click', {
      creationId: creation.id,
      creationTitle: creation.title,
    });
  };

  const isAvailable = creation.status !== 'Indisponible';
  const statusBadge =
    creation.status === 'Disponible sur commande' ? (
      <span className="inline-flex items-center gap-1 text-[10px] tracking-wider px-2.5 py-1 rounded-sm border font-medium text-[#1B5E20] border-[#A5D6A7] bg-[#E8F5E9]/95 backdrop-blur-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
        Disponible sur commande
      </span>
    ) : creation.status === 'Création sur mesure' ? (
      <span className="inline-flex items-center gap-1 text-[10px] tracking-wider px-2.5 py-1 rounded-sm border font-medium text-[#8C6D42] border-[#DFC5A2] bg-[#FAF3E8]/95 backdrop-blur-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
        Sur-mesure exclusif
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[10px] tracking-wider px-2.5 py-1 rounded-sm border font-medium text-[#616161] border-[#E0E0E0] bg-[#F5F5F5]/95 backdrop-blur-xs">
        Indisponible
      </span>
    );

  const orderWhatsAppUrl = generateWhatsAppLink({
    type: 'creation',
    creationTitle: creation.title,
    creationRef: creation.ref,
    availability: creation.status,
    fabric: creation.fabric,
  });

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] transition-all duration-500 overflow-hidden border border-[#E8E2D9]/60 hover:border-[#C5A880]/70 hover:shadow-[0_12px_40px_rgba(197,168,128,0.12)]">
      {/* Visual Container */}
      <Link
        href={`/creations/${creation.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB] block"
      >
        <Image
          src={creation.images[0] || '/images/creations/costume-croise-rose.jpg'}
          alt={creation.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Minimalist Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 bg-[#0E0E10]/90 backdrop-blur-md text-[#FFFFFF] font-medium">
            {creation.gender}
          </span>
          <div className="scale-95 origin-top-right">
            {statusBadge}
          </div>
        </div>

        {/* Discreet Corner Arrow on Hover */}
        <div className="absolute bottom-3.5 right-3.5 w-8 h-8 bg-[#0E0E10] text-[#C5A880] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </Link>

      {/* Editorial Content Below Image */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#FFFFFF]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-[#8C8378] uppercase tracking-[0.2em]">
            <span>{creation.category}</span>
            <span className="font-mono text-[#C5A880] font-normal">{creation.ref}</span>
          </div>

          <Link href={`/creations/${creation.slug}`} className="block">
            <h3 className="font-serif-luxe text-base sm:text-lg text-[#0E0E10] group-hover:text-[#8C6D42] transition-colors leading-snug line-clamp-1 font-semibold">
              {creation.title}
            </h3>
          </Link>

          {creation.fabric && (
            <p className="text-[11px] text-[#6E675F] line-clamp-1 italic font-serif">
              {creation.fabric}
            </p>
          )}

          <div className="text-[9.5px] text-[#A39B8F] pt-1 flex items-center gap-1.5 tracking-wider uppercase">
            <span className="text-[#C5A880]">✦</span>
            <span>Cameroun · Europe · Canada</span>
          </div>
        </div>

        {/* Direct Action Link */}
        <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between gap-3">
          <Link
            href={`/creations/${creation.slug}`}
            className="text-[10px] uppercase tracking-[0.22em] text-[#0E0E10] hover:text-[#C5A880] transition-colors font-semibold luxury-underline py-0.5"
          >
            Découvrir
          </Link>

          <a
            href={orderWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] bg-[#0E0E10] hover:bg-[#C5A880] text-[#FFFFFF] hover:text-[#0E0E10] transition-all duration-300 font-semibold"
            title="Commander ce modèle via Yanlamode WhatsApp"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] group-hover:bg-[#0E0E10]" />
            <span>COMMANDER</span>
          </a>
        </div>
      </div>
    </div>
  );
}
