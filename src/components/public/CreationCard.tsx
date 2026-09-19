'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ArrowUpRight } from 'lucide-react';
import { Creation } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

interface CreationCardProps {
  creation: Creation;
}

export default function CreationCard({ creation }: CreationCardProps) {
  const [isWishlist, setIsWishlist] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('whatsapp_click', {
      creationId: creation.id,
      creationTitle: creation.title,
    });
  };

  const orderWhatsAppUrl = generateWhatsAppLink({
    type: 'creation',
    creationTitle: creation.title,
    creationRef: creation.ref,
    availability: creation.status,
    fabric: creation.fabric,
  });

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/70 hover:shadow-xl transition-all duration-300">
      {/* Visual Container (VELORA Rounded Style) */}
      <Link
        href={`/creations/${creation.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F4F6] block"
      >
        <Image
          src={creation.images[0] || '/images/creations/costume-croise-rose.jpg'}
          alt={creation.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Minimalist Floating Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-white/95 text-gray-900 rounded-md shadow-xs">
            {creation.gender}
          </span>
        </div>

        {/* Wishlist Heart Button (VELORA Style at bottom right of image) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlist(!isWishlist);
          }}
          className={`absolute bottom-3 right-3 p-2 rounded-full shadow-sm transition-all hover:scale-110 ${
            isWishlist
              ? 'bg-red-50 text-red-500'
              : 'bg-white/95 text-gray-700 hover:text-black hover:bg-white'
          }`}
          title="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isWishlist ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Editorial Content Below Image (VELORA Style) */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>{creation.category}</span>
            <span className="font-mono text-[#8C6D42] font-semibold">{creation.ref}</span>
          </div>

          <Link href={`/creations/${creation.slug}`} className="block">
            <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#8C6D42] transition-colors leading-snug line-clamp-1">
              {creation.title}
            </h3>
          </Link>

          {creation.fabric && (
            <p className="text-[11px] text-gray-500 line-clamp-1 italic">
              {creation.fabric}
            </p>
          )}

          <div className="text-[10px] text-gray-400 pt-1 flex items-center gap-1.5 font-medium">
            <span className="text-[#C5A880]">✦</span>
            <span>Cameroun · Europe · Canada</span>
          </div>
        </div>

        {/* Direct Action Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
          <Link
            href={`/creations/${creation.slug}`}
            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-center rounded-xl text-xs font-semibold transition-colors"
          >
            Détails
          </Link>
          <a
            href={orderWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex-1 py-2 px-3 bg-gray-900 hover:bg-black text-white text-center rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Commander</span>
          </a>
        </div>
      </div>
    </div>
  );
}
