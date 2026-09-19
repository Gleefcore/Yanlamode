'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Collection } from '@/lib/types';
import { Plus, Edit2, FolderKanban, Check, Eye } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="font-serif-luxe text-3xl text-white">Gestion des Collections</h1>
          <p className="text-xs text-[#737373] mt-1">
            Structurez vos lignes éditoriales, séries capsules et univers haute couture.
          </p>
        </div>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-6 bg-[#121212] border border-[#222222] rounded-sm flex gap-6 items-center"
          >
            <div className="relative w-24 h-32 rounded-sm overflow-hidden bg-black shrink-0 border border-[#262626]">
              <Image src={col.coverImage} alt={col.title} fill className="object-cover" />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880]">
                  {col.season || 'Édition Permanente'}
                </span>
                <span className="px-2 py-0.5 text-[10px] rounded-sm bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                  Publiée
                </span>
              </div>

              <h3 className="font-serif-luxe text-xl text-white truncate">
                {col.title}
              </h3>

              <p className="text-xs text-[#737373] line-clamp-2">
                {col.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-[#A3A3A3]">
                <span className="font-mono text-[11px]">{col.creationsCount || 3} créations rattachées</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
