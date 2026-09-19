'use client';

import { useState, useEffect } from 'react';
import CreationCard from '@/components/public/CreationCard';
import { Creation } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const CATEGORIES = ['Toutes', 'Disponibles', 'Sur mesure', 'Homme', 'Femme', 'Cérémonie', 'Mariage', 'Traditionnel Chic'];

export default function CreationsCatalogPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('page_view', { path: '/creations' });

    async function loadCreations() {
      try {
        const res = await fetch('/api/creations');
        const data = await res.json();
        setCreations(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCreations();
  }, []);

  const filtered = creations.filter((item) => {
    const matchesCategory =
      activeCategory === 'Toutes' ||
      (activeCategory === 'Disponibles' && item.status !== 'Indisponible') ||
      (activeCategory === 'Sur mesure' && item.status === 'Création sur mesure') ||
      (activeCategory === 'Homme' && item.gender === 'Homme') ||
      (activeCategory === 'Femme' && item.gender === 'Femme') ||
      (activeCategory === 'Cérémonie' && (item.category === 'Cérémonie' || item.category === 'Costume & Smoking')) ||
      (activeCategory === 'Mariage' && (item.category === 'Cérémonie' || item.description.toLowerCase().includes('mariage'))) ||
      (activeCategory === 'Traditionnel Chic' && item.category === 'Traditionnel Chic');

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ref.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title section */}
      <div className="text-center space-y-3">
        <span className="text-[11px] uppercase tracking-[0.32em] text-[#C5A880] font-semibold">
          Catalogue Général &amp; Commandes
        </span>
        <h1 className="font-serif-luxe text-4xl sm:text-6xl text-[#0E0E10] font-normal">
          Nos Créations d'Exception
        </h1>
        <p className="text-xs sm:text-sm text-[#666158] max-w-lg mx-auto font-light leading-relaxed">
          Silhouettes haute couture, costumes et tenues d'apparat. <span className="font-medium text-[#0E0E10]">Livraison partout au Cameroun, en Europe et au Canada</span>.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-[#FFFFFF] border border-[#E8E2D9] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10.5px] uppercase tracking-[0.2em] transition-all whitespace-nowrap font-medium ${
                  activeCategory === cat
                    ? 'bg-[#0E0E10] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#555047] hover:text-[#0E0E10] border border-[#E8E2D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              placeholder="Rechercher (tissu, modèle, réf)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#0E0E10] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Delivery Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#7A746B] px-1">
        <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase">
          <span>{filtered.length} création(s)</span>
          {activeCategory !== 'Toutes' && (
            <span className="text-[#8C6D42] font-medium">• {activeCategory}</span>
          )}
        </div>
        <span className="text-[#8C6D42] text-[10.5px] tracking-wider uppercase font-medium">
          ✦ Expéditions sécurisées au Cameroun · Europe · Canada
        </span>
      </div>

      {/* Creations Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#777777]">
          Présentation des créations en cours...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center space-y-4 bg-[#FFFFFF] border border-[#E8E2D9] p-8">
          <p className="text-xs uppercase tracking-wider text-[#777777]">Aucune création ne correspond à vos critères.</p>
          <button
            onClick={() => {
              setActiveCategory('Toutes');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#0E0E10] text-xs text-[#FFFFFF] uppercase tracking-[0.2em] hover:bg-[#C5A880] hover:text-[#0E0E10] transition-colors font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <CreationCard key={item.id} creation={item} />
          ))}
        </div>
      )}
    </div>
  );
}
