'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collection, Creation } from '@/lib/types';
import CreationCard from '@/components/public/CreationCard';
import { ArrowRight } from 'lucide-react';
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

  const activeCollection = collections.find(c => c.id === selectedCollection);
  const filteredCreations = selectedCollection
    ? creations.filter(c => c.collectionId === selectedCollection)
    : creations;

  return (
    <div className="pt-32 pb-24 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
          Lignes Éditoriales
        </span>
        <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl text-[#111111]">
          Les Collections
        </h1>
        <p className="text-sm text-[#666666] max-w-xl mx-auto font-light leading-relaxed">
          Chaque collection est une exploration thématique où se mêlent tradition, rigueur géométrique et tombés sculpturaux.
        </p>
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
                className={`group relative h-[480px] rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 flex flex-col justify-end p-8 shadow-md ${
                  isSelected
                    ? 'border-[#C5A880] ring-2 ring-[#C5A880]/50'
                    : 'border-[#E5DFD7] hover:border-[#C5A880]'
                }`}
              >
                <Image
                  src={col.coverImage}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.55] group-hover:brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                      {col.season || 'Collection Permanente'}
                    </span>
                    <span className="text-[10px] text-white/90 border border-white/30 bg-black/30 px-2 py-0.5 rounded-sm">
                      {creations.filter(c => c.collectionId === col.id).length} Modèles
                    </span>
                  </div>

                  <h3 className="font-serif-luxe text-3xl text-white group-hover:text-[#C5A880] transition-colors">
                    {col.title}
                  </h3>

                  <p className="text-xs text-[#E5E5E5] leading-relaxed line-clamp-2">
                    {col.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A880] font-medium">
                    <span>{isSelected ? 'Affichage des modèles ci-dessous' : 'Filtrer les créations de cette collection'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Associated Creations Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8 border-t border-[#E5DFD7]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-luxe text-2xl sm:text-3xl text-[#111111]">
              {activeCollection ? `Créations : ${activeCollection.title}` : 'Toutes les Créations des Collections'}
            </h2>
            <p className="text-xs text-[#777777] mt-1">
              {filteredCreations.length} pièce(s) d'exception
            </p>
          </div>

          {selectedCollection && (
            <button
              onClick={() => setSelectedCollection(null)}
              className="text-xs text-[#9E7A45] hover:text-[#111111] uppercase tracking-wider underline underline-offset-4 font-semibold"
            >
              Afficher toutes les collections
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[#777777]">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCreations.map((c) => (
              <CreationCard key={c.id} creation={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
