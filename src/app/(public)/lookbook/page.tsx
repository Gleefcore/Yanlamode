'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Creation } from '@/lib/types';
import GalleryModal from '@/components/public/GalleryModal';
import { Maximize2, MessageCircle, ArrowUpRight, Sparkles, Globe } from 'lucide-react';
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
    <div className="pt-32 pb-24 space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-medium">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>Portfolio Visuel & Défilé Privé</span>
        </div>

        <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl text-[#0E0E10] tracking-tight">
          Le Lookbook YANLAMODE
        </h1>

        <p className="text-xs sm:text-sm text-[#666360] max-w-xl mx-auto font-light leading-relaxed">
          Une immersion visuelle au cœur de nos coupes architecturales, des drapés souples et des matières nobles sélectionnées pour nos clients d'Afrique et de la diaspora.
        </p>

        {/* Global Delivery Assurance */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#9E7A45]">
          <Globe className="w-3.5 h-3.5" />
          <span>Créations disponibles sur commande · Expéditions : Cameroun, Europe, Canada</span>
        </div>
      </div>

      {/* Categories Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LOOKBOOK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 text-[11px] uppercase tracking-[0.22em] rounded-sm transition-all duration-300 whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#0E0E10] text-[#FAF8F5] font-medium shadow-md'
                : 'bg-white text-[#73706B] hover:text-[#0E0E10] border border-[#E8E2D9] hover:border-[#C5A880]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className="break-inside-avoid group relative rounded-sm overflow-hidden border border-[#E8E2D9] bg-white shadow-sm transition-all duration-700 hover:border-[#C5A880] hover:shadow-2xl"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB]">
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10]/95 via-[#0E0E10]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Hover Overlay Controls */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] bg-black/60 px-2.5 py-1 rounded-sm border border-white/10 backdrop-blur-sm">
                    {item.ref}
                  </span>
                  <button
                    onClick={() => setModalIndex(idx)}
                    className="p-2.5 bg-black/70 hover:bg-black text-white rounded-full border border-white/20 transition-all hover:scale-110 shadow-lg"
                    title="Agrandir en plein écran"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A880] font-semibold block">
                      {item.category} · {item.gender}
                    </span>
                    <h3 className="font-serif-luxe text-xl sm:text-2xl text-white font-normal mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/creations/${item.slug}`}
                      className="flex-1 text-center py-2.5 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#C5A880] hover:text-black transition-all"
                    >
                      Voir Silhouette
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
                      className="px-3.5 py-2.5 bg-[#0E0E10] hover:bg-[#C5A880] text-white hover:text-black text-[10px] uppercase tracking-[0.2em] font-semibold rounded-sm transition-all flex items-center gap-1.5 border border-[#C5A880]/50"
                      title="Commander ce modèle"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                      <span>COMMANDER</span>
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
