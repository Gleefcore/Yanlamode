'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Creation, CreationStatus, CreationCategory, GenderCategory } from '@/lib/types';
import { Plus, Edit2, Trash2, Eye, Star, Check, X, Search, Sparkles } from 'lucide-react';

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
    colors: 'Noir Profond, Or',
    status: 'Disponible sur commande' as CreationStatus,
    image: '/images/creations/costume-croise-rose.jpg',
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
      colors: 'Noir, Or',
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
      image: c.images[0] || '/images/creations/costume-croise-rose.jpg',
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
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la création "${title}" ?`)) return;
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

  const filtered = creations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.ref.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="font-serif-luxe text-3xl text-white">Gestion du Catalogue & Créations</h1>
          <p className="text-xs text-[#737373] mt-1">
            Ajoutez de nouveaux modèles, modifiez les matières, activez le sur-mesure ou masquez une pièce.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-[#d4af37] shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une création</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#121212] p-4 border border-[#222222] rounded-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#181818] border border-[#262626] rounded-sm text-xs text-white placeholder-[#737373] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
        <span className="text-xs text-[#737373]">{filtered.length} pièce(s) au catalogue</span>
      </div>

      {/* Creations Table */}
      <div className="bg-[#121212] border border-[#222222] rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#262626] text-[#737373] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Création</th>
              <th className="py-3 px-4">Catégorie & Genre</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-center">En vedette</th>
              <th className="py-3 px-4 text-center">Vues</th>
              <th className="py-3 px-4 text-center">Clics WA</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-[#737373]">
                  Chargement du catalogue...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-[#737373]">
                  Aucun modèle trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#161616]">
                  {/* Photo & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded-sm overflow-hidden bg-black shrink-0 border border-[#262626]">
                        <Image src={c.images[0]} alt={c.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-medium line-clamp-1">{c.title}</p>
                        <p className="text-[#C5A880] text-[10px] font-mono mt-0.5">{c.ref}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category & Gender */}
                  <td className="py-3 px-4 text-[#A3A3A3]">
                    <span className="block text-white">{c.category}</span>
                    <span className="text-[10px] text-[#737373]">{c.gender}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] border ${
                      c.status === 'Disponible sur commande'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                        : c.status === 'Création sur mesure'
                        ? 'border-[#C5A880]/30 text-[#C5A880] bg-[#C5A880]/10'
                        : 'border-zinc-700 text-zinc-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  {/* Featured toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(c)}
                      className={`p-1.5 rounded-sm transition-colors ${
                        c.featured ? 'text-amber-400 bg-amber-400/10' : 'text-[#404040] hover:text-white'
                      }`}
                      title={c.featured ? 'Retirer de la vitrine' : 'Mettre en vedette'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>

                  {/* Views */}
                  <td className="py-3 px-4 text-center font-mono text-[#A3A3A3]">
                    {c.viewsCount}
                  </td>

                  {/* WhatsApp clicks */}
                  <td className="py-3 px-4 text-center font-mono text-[#25D366]">
                    {c.whatsappClicksCount}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-[#A3A3A3] hover:text-white hover:bg-[#222222] rounded-sm"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-sm"
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#262626] rounded-sm max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <h3 className="font-serif-luxe text-2xl text-white">
                {editingId ? 'Modifier la Création' : 'Ajouter une Nouvelle Création'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#737373] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A3A3A3] mb-1">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                    placeholder="Ex : Smoking Col Châle Soie"
                  />
                </div>

                <div>
                  <label className="block text-[#A3A3A3] mb-1">Référence Unique *</label>
                  <input
                    type="text"
                    required
                    value={form.ref}
                    onChange={(e) => setForm({ ...form, ref: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none font-mono"
                    placeholder="YM-HC-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#A3A3A3] mb-1">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A3A3A3] mb-1">Genre</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Unisexe">Unisexe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A3A3A3] mb-1">Statut</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A3A3A3] mb-1">Matière & Tissus nobles</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                    placeholder="Drap de laine superfine, satin de soie..."
                  />
                </div>

                <div>
                  <label className="block text-[#A3A3A3] mb-1">Nuances / Couleurs (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                    placeholder="Noir Intense, Or, Blanc"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A3A3A3] mb-1">Chemin d’image</label>
                <select
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                >
                  <option value="/images/creations/costume-croise-rose.jpg">Costume Croisé Rose Poudré</option>
                  <option value="/images/creations/smoking-vert-sauge.jpg">Smoking Vert Sauge</option>
                  <option value="/images/creations/agbada-noir-diamant.jpg">Agbada Noir Relief Diamant</option>
                  <option value="/images/creations/smoking-noir-prestige.jpg">Smoking Noir Prestige</option>
                  <option value="/images/creations/ensemble-blanc-oiseau.jpg">Ensemble Blanc Oiseaux Brodés</option>
                  <option value="/images/creations/costume-ceremonie-blanc-rouge.jpg">Gilet d'Apparat Blanc & Coiffe</option>
                  <option value="/images/creations/robe-batik-franges.jpg">Robe Batik Indigo Franges</option>
                  <option value="/images/creations/tunique-dentelle-suisse.jpg">Tunique Dentelle Suisse</option>
                  <option value="/images/creations/robe-maxi-batik-bronze.jpg">Robe Maxi Batik Cuivre</option>
                  <option value="/images/creations/robe-tunique-violet-indigo.jpg">Robe Kimono Batik Violet</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A3A3A3] mb-1">Description éditoriale</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:border-[#C5A880] focus:outline-none"
                  placeholder="Décrivez la silhouette, les surpiqûres, les finitions..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-[#262626] bg-[#181818] text-[#C5A880] focus:ring-0"
                />
                <label htmlFor="featured" className="text-[#D4D4D4] cursor-pointer">
                  Mettre en vedette sur la page d’accueil
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#262626] text-[#A3A3A3] hover:text-white rounded-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C5A880] text-black font-semibold uppercase tracking-wider rounded-sm hover:bg-[#d4af37]"
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
