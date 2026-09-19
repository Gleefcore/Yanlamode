'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Creation, CreationStatus, CreationCategory, GenderCategory } from '@/lib/types';
import { Plus, Edit2, Trash2, Star, X, Search, Sparkles, Filter, Check, Eye, MessageCircle } from 'lucide-react';

const CATEGORIES: CreationCategory[] = [
  'Haute Couture',
  'Sur mesure',
  'Cérémonie',
  'Mariage',
  'Traditionnel Chic',
  'Costume & Smoking',
];

const STATUSES: CreationStatus[] = [
  'Disponible sur commande',
  'Création sur mesure',
  'Indisponible',
];

export default function AdminCreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    ref: '',
    collectionId: 'col-ceremonie',
    category: 'Haute Couture' as CreationCategory,
    gender: 'Homme' as GenderCategory,
    description: '',
    fabric: '',
    colors: 'Noir Profond, Or Impérial',
    status: 'Disponible sur commande' as CreationStatus,
    image: '/images/creations/smoking-noir-prestige.jpg',
    featured: false,
  });

  useEffect(() => {
    fetchCreations();
  }, []);

  async function fetchCreations() {
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

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      ref: `YM-HC-${Math.floor(100 + Math.random() * 900)}`,
      collectionId: 'col-ceremonie',
      category: 'Haute Couture',
      gender: 'Homme',
      description: '',
      fabric: '',
      colors: 'Noir Profond, Or Impérial',
      status: 'Disponible sur commande',
      image: '/images/creations/smoking-noir-prestige.jpg',
      featured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Creation) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      ref: c.ref,
      collectionId: c.collectionId,
      category: c.category,
      gender: c.gender,
      description: c.description,
      fabric: c.fabric,
      colors: c.colors.join(', '),
      status: c.status,
      image: c.images[0] || '/images/creations/smoking-noir-prestige.jpg',
      featured: c.featured,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload = {
      title: form.title,
      slug,
      ref: form.ref,
      collectionId: form.collectionId,
      category: form.category,
      gender: form.gender,
      description: form.description,
      fabric: form.fabric,
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      status: form.status,
      images: [form.image],
      featured: form.featured,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/creations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (res.ok) {
          fetchCreations();
          setModalOpen(false);
        }
      } else {
        const res = await fetch('/api/creations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchCreations();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Confirmer la suppression de la création "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/creations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCreations(creations.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (c: Creation) => {
    try {
      const res = await fetch('/api/creations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: c.id, featured: !c.featured }),
      });
      if (res.ok) {
        setCreations(
          creations.map((item) => (item.id === c.id ? { ...item, featured: !item.featured } : item))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = creations.filter((c) => {
    const matchesCategory = selectedCategory === 'Toutes' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.ref.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.fabric.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredCount = creations.filter((c) => c.featured).length;
  const totalViews = creations.reduce((acc, c) => acc + (c.viewsCount || 0), 0);
  const totalClicks = creations.reduce((acc, c) => acc + (c.whatsappClicksCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
              Inventaire & Lookbook Studio
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono text-zinc-400">
              {creations.length} Pièces Actives
            </span>
          </div>
          <h1 className="font-serif-luxe text-3xl sm:text-4xl text-white tracking-wide mt-1">
            Catalogue Haute Couture
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
            Supervisez les silhouettes du catalogue, ajustez les statuts de disponibilité et configurez la mise en avant vitrine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-[0.18em] rounded-sm hover:bg-[#D4AF37] shadow-lg shadow-[#C5A880]/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Pièce</span>
          </button>
        </div>
      </div>

      {/* KPI Mini-Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Total Modèles</span>
          <p className="font-serif-luxe text-2xl text-white font-bold">{creations.length}</p>
          <span className="text-[10px] text-zinc-400">En ligne sur le site</span>
        </div>
        <div className="p-4 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-[#C5A880] block">En Vedette Vitrine</span>
          <p className="font-serif-luxe text-2xl text-[#C5A880] font-bold">{featuredCount}</p>
          <span className="text-[10px] text-zinc-400">Affichés en page d'accueil</span>
        </div>
        <div className="p-4 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Consultations Fiches</span>
          <p className="font-serif-luxe text-2xl text-white font-bold">{totalViews.toLocaleString('fr-FR')}</p>
          <span className="text-[10px] text-zinc-400">Vues cumulées</span>
        </div>
        <div className="p-4 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 block">Commandes Initiées</span>
          <p className="font-serif-luxe text-2xl text-emerald-400 font-bold">{totalClicks.toLocaleString('fr-FR')}</p>
          <span className="text-[10px] text-zinc-400">Clics vers l'Atelier</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0E0E12] p-4 border border-white/[0.08] rounded-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('Toutes')}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
              selectedCategory === 'Toutes'
                ? 'bg-[#C5A880] text-black font-semibold shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.05]'
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#C5A880] text-black font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, réf, matière..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] transition-colors"
          />
        </div>
      </div>

      {/* Creations Table */}
      <div className="bg-[#0E0E12] border border-white/[0.08] rounded-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] tracking-[0.2em]">
              <tr>
                <th className="py-3.5 px-4 font-normal">Modèle Haute Couture</th>
                <th className="py-3.5 px-4 font-normal">Ligne & Silhouette</th>
                <th className="py-3.5 px-4 font-normal">Disponibilité</th>
                <th className="py-3.5 px-4 text-center font-normal">Vitrine</th>
                <th className="py-3.5 px-4 text-center font-normal">Engagement</th>
                <th className="py-3.5 px-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-zinc-500">
                    Chargement du catalogue haute couture...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-zinc-500">
                    Aucune silhouette trouvée pour cette sélection.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Photo & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-16 rounded-sm overflow-hidden bg-black shrink-0 border border-white/[0.1] shadow-sm">
                          <Image src={c.images[0]} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-white font-medium text-xs group-hover:text-[#C5A880] transition-colors">
                            {c.title}
                          </p>
                          <p className="text-[#C5A880] text-[10px] font-mono tracking-wider">
                            {c.ref}
                          </p>
                          <p className="text-zinc-500 text-[10px] truncate max-w-xs font-light">
                            {c.fabric || 'Tissus nobles sélectionnés'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Gender */}
                    <td className="py-3.5 px-4">
                      <span className="block text-zinc-200 font-medium text-xs">{c.category}</span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{c.gender}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider border ${
                        c.status === 'Disponible sur commande'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                          : c.status === 'Création sur mesure'
                          ? 'border-[#C5A880]/30 text-[#C5A880] bg-[#C5A880]/10'
                          : 'border-zinc-700/50 text-zinc-400 bg-zinc-900/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'Disponible sur commande'
                            ? 'bg-emerald-400'
                            : c.status === 'Création sur mesure'
                            ? 'bg-[#C5A880]'
                            : 'bg-zinc-500'
                        }`} />
                        <span>{c.status}</span>
                      </span>
                    </td>

                    {/* Featured toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(c)}
                        className={`p-1.5 rounded-sm transition-all ${
                          c.featured
                            ? 'text-[#C5A880] bg-[#C5A880]/15 ring-1 ring-[#C5A880]/30 shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05]'
                        }`}
                        title={c.featured ? 'Retirer de la vitrine' : 'Mettre en vedette'}
                      >
                        <Star className={`w-4 h-4 ${c.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Views & Orders */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-zinc-400 text-[11px] font-mono">
                        <span className="flex items-center gap-1" title="Vues">
                          <Eye className="w-3 h-3 text-zinc-500" />
                          {c.viewsCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-[#C5A880]" title="Commandes WhatsApp">
                          <MessageCircle className="w-3 h-3" />
                          {c.whatsappClicksCount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-zinc-400 hover:text-[#C5A880] hover:bg-white/[0.05] rounded-sm transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-sm transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0E0E12] border border-white/[0.1] rounded-sm max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  Fiche Technique Atelier
                </span>
                <h3 className="font-serif-luxe text-2xl text-white mt-1">
                  {editingId ? 'Modifier la Silhouette' : 'Créer une Nouvelle Silhouette'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-sm hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none transition-colors"
                    placeholder="Ex : Smoking Col Châle Soie Impériale"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Référence Unique *</label>
                  <input
                    type="text"
                    required
                    value={form.ref}
                    onChange={(e) => setForm({ ...form, ref: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none font-mono"
                    placeholder="YM-HC-101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#141418] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Genre</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#141418] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Unisexe">Unisexe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Statut Commercial</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#141418] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Matières & Étoffes Nobles</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                    placeholder="Drap de laine superfine 150s, soie naturelle..."
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Nuances & Couleurs</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                    placeholder="Noir Profond, Or Impérial"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Sélection Visuel Haute Couture</label>
                <select
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141418] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                >
                  <option value="/images/creations/smoking-noir-prestige.jpg">Smoking Noir Prestige (Broderies Or)</option>
                  <option value="/images/creations/costume-croise-rose.jpg">Costume Croisé Rose Poudré</option>
                  <option value="/images/creations/smoking-vert-sauge.jpg">Smoking Vert Sauge & Col Châle</option>
                  <option value="/images/creations/agbada-noir-diamant.jpg">Agbada Noir Relief Diamant</option>
                  <option value="/images/creations/ensemble-blanc-oiseau.jpg">Ensemble Blanc Oiseaux Brodés</option>
                  <option value="/images/creations/costume-ceremonie-blanc-rouge.jpg">Gilet d'Apparat Blanc & Coiffe</option>
                  <option value="/images/creations/robe-batik-franges.jpg">Robe Batik Indigo Franges</option>
                  <option value="/images/creations/tunique-dentelle-suisse.jpg">Tunique Dentelle Suisse Ajourée</option>
                  <option value="/images/creations/robe-maxi-batik-bronze.jpg">Robe Maxi Batik Bronze Cuivre</option>
                  <option value="/images/creations/robe-tunique-violet-indigo.jpg">Robe Kimono Batik Violet Impérial</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Description Éditoriale de la Pièce</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:border-[#C5A880] focus:outline-none leading-relaxed"
                  placeholder="Détaillez la coupe, le tombé, les finitions et la silhouette..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-white/[0.2] bg-white/[0.05] text-[#C5A880] focus:ring-0"
                />
                <label htmlFor="featured" className="text-zinc-300 cursor-pointer font-medium">
                  Mettre en vedette dans la vitrine principale
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/[0.1] text-zinc-400 hover:text-white rounded-sm hover:bg-white/[0.05] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C5A880] text-black font-semibold uppercase tracking-wider rounded-sm hover:bg-[#D4AF37] transition-all shadow-md shadow-[#C5A880]/15"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
