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
    <div className="group relative bg-[#FFFFFF] border border-[#E8E2D9] hover:border-[#C5A880] transition-all duration-500 rounded-sm overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(197,168,128,0.15)]">
      {/* Visual Container */}
      <Link
        href={`/creations/${creation.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F1EA] block"
      >
        <Image
          src={creation.images[0] || '/images/creations/costume-croise-rose.jpg'}
          alt={creation.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#111111]/85 backdrop-blur-sm text-white font-medium rounded-sm">
            {creation.gender}
          </span>
          {statusBadge}
        </div>

        {/* Hover Quick View Link */}
        <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/95 border border-[#C5A880] flex items-center justify-center text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
          <ArrowUpRight className="w-4 h-4 text-[#C5A880]" />
        </div>
      </Link>

      {/* Content details (Pure White Background with Crisp Black Typography) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#FFFFFF]">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#7A7571] mb-1.5 uppercase tracking-wider">
            <span>{creation.category}</span>
            <span className="text-[#C5A880] font-mono font-medium text-[10px]">{creation.ref}</span>
          </div>

          <Link href={`/creations/${creation.slug}`}>
            <h3 className="font-serif-luxe text-lg text-[#111111] group-hover:text-[#C5A880] transition-colors leading-snug line-clamp-1 font-semibold">
              {creation.title}
            </h3>
          </Link>

          <p className="text-xs text-[#66615B] mt-2 line-clamp-2 leading-relaxed">
            {creation.description}
          </p>

          <p className="text-[10px] text-[#8C8378] mt-2 flex items-center gap-1.5 font-medium">
            <span className="text-[#C5A880]">✦</span>
            <span>Livraison : Cameroun • Europe • Canada</span>
          </p>
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-[#F1EBE1] flex items-center gap-2">
          <Link
            href={`/creations/${creation.slug}`}
            className="flex-1 py-2 text-center text-[11px] uppercase tracking-widest text-[#111111] hover:text-white bg-transparent hover:bg-[#111111] border border-[#D5CEC4] hover:border-[#111111] rounded-sm transition-all duration-300 font-medium"
          >
            Détails
          </Link>
          <a
            href={orderWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#111111] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#111111] border border-[#C5A880]/50 hover:border-[#C5A880] rounded-sm transition-all duration-300 text-[11px] font-semibold shadow-xs"
            title="Commander ce modèle via Yanlamode WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#C5A880] group-hover:text-[#111111] fill-current" />
            <span>Commander</span>
          </a>
        </div>
      </div>
    </div>
  );
}
