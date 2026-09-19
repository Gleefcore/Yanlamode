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
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
          Catalogue Général &amp; Commandes
        </span>
        <h1 className="font-serif-luxe text-4xl sm:text-6xl text-[#111111]">
          Nos Créations d'Exception
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">
          Silhouettes haute couture, costumes et tenues d'apparat. <strong>Livraison partout au Cameroun, en Europe et au Canada</strong>.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-6 bg-[#FFFFFF] border border-[#E5DFD7] shadow-sm p-6 rounded-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-[#FAF8F5] font-semibold shadow-sm'
                    : 'bg-[#FAF8F5] text-[#555555] hover:text-[#111111] border border-[#E5DFD7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              placeholder="Rechercher (tissu, modèle, réf)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Delivery Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#777777] px-2">
        <div className="flex items-center gap-2">
          <span>{filtered.length} création(s) trouvée(s)</span>
          {activeCategory !== 'Toutes' && (
            <span className="text-[#9E7A45] font-semibold">• Filtre : {activeCategory}</span>
          )}
        </div>
        <span className="text-[#8C6D42] text-[11px] font-medium">
          ✦ Expéditions assurées partout au Cameroun, en Europe et au Canada
        </span>
      </div>

      {/* Creations Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-[#777777]">
          Chargement des modèles...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="text-sm text-[#777777]">Aucune création ne correspond à vos critères.</p>
          <button
            onClick={() => {
              setActiveCategory('Toutes');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#FFFFFF] border border-[#C5A880] text-xs text-[#9E7A45] uppercase tracking-wider rounded-sm hover:bg-[#C5A880] hover:text-white transition-colors"
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
