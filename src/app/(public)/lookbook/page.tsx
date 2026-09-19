'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Creation } from '@/lib/types';
import GalleryModal from '@/components/public/GalleryModal';
import { Maximize2, MessageCircle, ArrowUpRight } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

const LOOKBOOK_CATEGORIES = ['Toutes', 'Homme', 'Femme', 'Cérémonie', 'Traditionnel Chic'];

export default function LookbookPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    trackEvent('page_view', { path: '/lookbook' });

    async function fetchCreations() {
      try {
        const res = await fetch('/api/creations');
        const data = await res.json();
        setCreations(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCreations();
  }, []);

  const filtered = creations.filter((item) => {
    if (activeCategory === 'Toutes') return true;
    if (activeCategory === 'Homme') return item.gender === 'Homme';
    if (activeCategory === 'Femme') return item.gender === 'Femme';
    if (activeCategory === 'Cérémonie') return item.category === 'Cérémonie' || item.category === 'Costume & Smoking';
    if (activeCategory === 'Traditionnel Chic') return item.category === 'Traditionnel Chic';
    return true;
  });

  const allImages = filtered.map((c) => c.images[0]);

  return (
    <div className="pt-32 pb-24 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
          Portfolio Éditorial
        </span>
        <h1 className="font-serif-luxe text-4xl sm:text-6xl text-[#111111]">
          Le Lookbook YANLAMODE
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">
          Une immersion visuelle au cœur de nos silhouettes, matières travaillées et jeux de volumes architecturaux.
        </p>
      </div>

      {/* Categories */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LOOKBOOK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 text-xs uppercase tracking-widest rounded-sm transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#111111] text-[#FAF8F5] font-semibold shadow-sm'
                : 'bg-[#FFFFFF] text-[#555555] hover:text-[#111111] border border-[#E5DFD7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className="break-inside-avoid group relative rounded-sm overflow-hidden border border-[#E5DFD7] bg-[#FFFFFF] shadow-sm transition-all duration-500 hover:border-[#C5A880] hover:shadow-lg"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover Overlay Controls */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-end">
                  <button
                    onClick={() => setModalIndex(idx)}
                    className="p-2.5 bg-black/60 hover:bg-black text-white rounded-full border border-white/20 transition-colors"
                    title="Plein écran"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold block">
                    {item.category} · {item.gender}
                  </span>
                  <h3 className="font-serif-luxe text-xl text-white font-medium">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/creations/${item.slug}`}
                      className="flex-1 text-center py-2 bg-white text-black text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-[#C5A880] hover:text-white transition-colors"
                    >
                      Voir le modèle
                    </Link>
                    <a
                      href={generateWhatsAppLink({
                        type: 'creation',
                        creationTitle: item.title,
                        creationRef: item.ref,
                        availability: item.status,
                        fabric: item.fabric,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-[#111111] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#111111] text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-colors flex items-center gap-1.5 border border-[#C5A880]/40"
                      title="Commander ce modèle"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Commander</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      <GalleryModal
        isOpen={modalIndex !== null}
        images={allImages}
        currentIndex={modalIndex || 0}
        onClose={() => setModalIndex(null)}
        onPrev={() => setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allImages.length - 1))}
        onNext={() => setModalIndex((prev) => (prev !== null && prev < allImages.length - 1 ? prev + 1 : 0))}
        title={modalIndex !== null ? filtered[modalIndex]?.title : ''}
      />
    </div>
  );
}
