'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collection, Creation } from '@/lib/types';
import CreationCard from '@/components/public/CreationCard';
import { ArrowRight, Sparkles, Globe } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('page_view', { path: '/collections' });

    async function loadData() {
      try {
        const [resCol, resCrea] = await Promise.all([
          fetch('/api/collections'),
          fetch('/api/creations'),
        ]);
        const cols = await resCol.json();
        const creas = await resCrea.json();
        setCollections(Array.isArray(cols) ? cols : []);
        setCreations(Array.isArray(creas) ? creas : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeCollection = collections.find((c) => c.id === selectedCollection);
  const filteredCreations = selectedCollection
    ? creations.filter((c) => c.collectionId === selectedCollection)
    : creations;

  return (
    <div className="pt-32 pb-24 space-y-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-medium">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>Lignes Éditoriales & Séries Capsules</span>
        </div>

        <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl text-[#0E0E10] tracking-tight">
          Les Collections Privées
        </h1>

        <p className="text-xs sm:text-sm text-[#666360] max-w-2xl mx-auto font-light leading-relaxed">
          Chaque collection est conçue comme un manifeste sculptural où s'entremêlent l'architecture du tailleur occidental, la noblesse des tissus d’Afrique et la précision des broderies d'apparat.
        </p>

        {/* Global Delivery Assurance */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#9E7A45]">
          <Globe className="w-3.5 h-3.5" />
          <span>Expéditions sécurisées : Cameroun · Europe · Canada</span>
        </div>
      </section>

      {/* Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => {
            const isSelected = selectedCollection === col.id;
            return (
              <div
                key={col.id}
                onClick={() => setSelectedCollection(isSelected ? null : col.id)}
                className={`group relative h-[500px] rounded-sm overflow-hidden border cursor-pointer transition-all duration-700 flex flex-col justify-end p-8 shadow-sm ${
                  isSelected
                    ? 'border-[#C5A880] ring-2 ring-[#C5A880]/40 shadow-xl'
                    : 'border-[#E8E2D9] hover:border-[#C5A880]'
                }`}
              >
                <Image
                  src={col.coverImage}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 filter brightness-[0.55] group-hover:brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-transparent" />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                      {col.season || 'Collection Permanente'}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/90 border border-white/20 bg-black/40 px-2.5 py-0.5 rounded-sm backdrop-blur-sm">
                      {creations.filter((c) => c.collectionId === col.id).length} Silhouettes
                    </span>
                  </div>

                  <h3 className="font-serif-luxe text-3xl sm:text-4xl text-white group-hover:text-[#C5A880] transition-colors">
                    {col.title}
                  </h3>

                  <p className="text-xs text-white/80 leading-relaxed line-clamp-2 font-light max-w-xl">
                    {col.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#C5A880] font-medium">
                    <span>{isSelected ? 'Sélection active · Modèles affichés ci-dessous' : 'Explorer les silhouettes de la collection'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Associated Creations Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-10 border-t border-[#E8E2D9]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold block">
              Vestiaire d'Exception
            </span>
            <h2 className="font-serif-luxe text-2xl sm:text-4xl text-[#0E0E10] mt-1">
              {activeCollection ? `Créations : ${activeCollection.title}` : 'Toutes les Silhouettes des Collections'}
            </h2>
            <p className="text-xs text-[#73706B] mt-1 font-light">
              {filteredCreations.length} pièce(s) de haute couture disponibles à la commande sur-mesure.
            </p>
          </div>

          {selectedCollection && (
            <button
              onClick={() => setSelectedCollection(null)}
              className="text-xs text-[#C5A880] hover:text-[#0E0E10] uppercase tracking-[0.18em] underline underline-offset-8 font-medium transition-colors"
            >
              Afficher le catalogue complet
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#73706B]">
            Chargement des silhouettes...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCreations.map((c) => (
              <CreationCard key={c.id} creation={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
