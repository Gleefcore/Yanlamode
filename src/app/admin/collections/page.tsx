'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collection } from '@/lib/types';
import { Plus, Edit2, FolderKanban, Check, Eye, Sparkles, Layers, ArrowRight } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        setCollections(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
              Direction Artistique
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono text-zinc-400">
              Lignes Éditoriales
            </span>
          </div>
          <h1 className="font-serif-luxe text-3xl sm:text-4xl text-white tracking-wide mt-1">
            Collections & Séries Capsules
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
            Structurez vos univers stylistiques, vos collections saisonnières et les thématiques présentées aux clients et acheteurs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-[#0E0E12] border border-[#C5A880]/30 rounded-sm text-xs flex items-center gap-2 text-[#C5A880]">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-mono font-semibold">{collections.length} Lignes Répertoriées</span>
          </div>
        </div>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-6 bg-[#0E0E12] border border-white/[0.08] rounded-sm flex gap-6 items-start hover:border-[#C5A880]/50 transition-all duration-300 group shadow-lg"
          >
            <div className="relative w-28 h-36 rounded-sm overflow-hidden bg-black shrink-0 border border-white/[0.1] shadow-md">
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                  {col.season || 'Édition Permanente'}
                </span>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-sm bg-emerald-950/30 text-emerald-400 border border-emerald-500/20">
                  En ligne
                </span>
              </div>

              <h3 className="font-serif-luxe text-xl text-white group-hover:text-[#C5A880] transition-colors truncate">
                {col.title}
              </h3>

              <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                {col.description}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-xs">
                <span className="font-mono text-[11px] text-zinc-400">
                  {col.creationsCount || 3} créations rattachées
                </span>

                <Link
                  href="/admin/creations"
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C5A880] hover:text-white transition-colors"
                >
                  <span>Gérer les modèles</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
