'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collection } from '@/lib/types';
import { Layers, ArrowRight } from 'lucide-react';

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Gestion des Collections & Séries Capsules
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organisez vos lignes éditoriales, thématiques de cérémonies et univers de haute couture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-700" />
            <span>{collections.length} Lignes Répertoriées</span>
          </span>
        </div>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-6 bg-white border border-gray-200/70 rounded-2xl flex gap-6 items-start hover:shadow-md transition-all duration-200 group"
          >
            <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-sm">
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D42]">
                  {col.season || 'Édition Permanente'}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  En ligne
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#8C6D42] transition-colors truncate">
                {col.title}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light">
                {col.description}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs">
                <span className="font-mono text-[11px] text-gray-500">
                  {col.creationsCount || 3} créations rattachées
                </span>

                <Link
                  href="/admin/creations"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-900 hover:text-[#8C6D42] transition-colors"
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
