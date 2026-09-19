'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Creation, CreationStatus, CreationCategory, GenderCategory } from '@/lib/types';
import { Plus, Edit2, Trash2, Star, X, Search, Sparkles, Filter, Eye, MessageCircle, Upload } from 'lucide-react';

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
    collectionId: 'col-ceremonie',
    category: 'Haute Couture' as CreationCategory,
    gender: 'Homme' as GenderCategory,
    description: '',
    fabric: '',
    status: 'Disponible sur commande' as CreationStatus,
    image: '',
    featured: false,
  });

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      collectionId: 'col-ceremonie',
      category: 'Haute Couture',
      gender: 'Homme',
      description: '',
      fabric: '',
      status: 'Disponible sur commande',
      image: '',
      featured: false,
    });
    setImagePreview(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Creation) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      collectionId: c.collectionId,
      category: c.category,
      gender: c.gender,
      description: c.description,
      fabric: c.fabric,
      status: c.status,
      image: c.images[0] || '',
      featured: c.featured,
    });
    setImagePreview(c.images[0] || null);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
      } else {
        alert(data.error || 'Erreur de téléchargement');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const ref = 'YM-' + Date.now();

    const payload = {
      title: form.title,
      slug,
      ref,
      collectionId: form.collectionId,
      category: form.category,
      gender: form.gender,
      description: form.description,
      fabric: form.fabric,
      colors: [],
      status: form.status,
      images: form.image ? [form.image] : [],
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
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.fabric.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Gestion du Catalogue Haute Couture
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Supervisez les silhouettes, ajustez les statuts de disponibilité et configurez la vitrine.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Silhouette</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('Toutes')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'Toutes'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Toutes ({creations.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher nom, matière..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-900"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Modèle Haute Couture</th>
                <th className="py-3.5 px-4 font-semibold">Catégorie</th>
                <th className="py-3.5 px-4 font-semibold">Statut</th>
                <th className="py-3.5 px-4 text-center font-semibold">Vitrine</th>
                <th className="py-3.5 px-4 text-center font-semibold">Engagement</th>
                <th className="py-3.5 px-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Chargement du catalogue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Aucune silhouette trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <Image src={c.images[0] || '/images/placeholder.jpg'} alt={c.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{c.title}</p>
                          <p className="text-gray-400 text-[10px] truncate max-w-xs">{c.fabric}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-gray-800">{c.category}</span>
                      <span className="text-[10px] text-gray-400 block">{c.gender}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          c.status === 'Disponible sur commande'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : c.status === 'Création sur mesure'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'Disponible sur commande'
                            ? 'bg-emerald-500'
                            : c.status === 'Création sur mesure'
                            ? 'bg-amber-500'
                            : 'bg-gray-400'
                        }`} />
                        <span>{c.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(c)}
                        className={`p-1.5 rounded-lg transition-all ${
                          c.featured
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-gray-300 hover:text-gray-600'
                        }`}
                        title={c.featured ? 'Retirer de la vitrine' : 'Mettre en vedette'}
                      >
                        <Star className={`w-4 h-4 ${c.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          {c.viewsCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {c.whatsappClicksCount || 0}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.title)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal in White Knowvio Style */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B48C56] tracking-wider block">
                  Éditeur de Silhouette
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  {editingId ? 'Modifier la Silhouette' : 'Créer une Nouvelle Silhouette'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
                    placeholder="Ex : Smoking Col Châle Soie Impériale"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Genre</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
                  >
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Unisexe">Unisexe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Statut Commercial</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Matières & Étoffes Nobles</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
                    placeholder="Drap de laine superfine 150s, satin..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-semibold">Téléverser un visuel</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group p-4 flex flex-col items-center justify-center min-h-[120px]">
                  {imagePreview ? (
                    <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-sm">
                      <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-medium">Glissez un fichier ou cliquez</p>
                      <p className="text-gray-400 text-[10px] mt-1">PNG, JPG, WEBP</p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                      <span className="text-gray-900 font-medium bg-white px-3 py-1 rounded-full shadow-sm text-[10px]">Chargement...</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-semibold">Description Éditoriale</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none leading-relaxed"
                  placeholder="Détaillez la coupe, le tombé, les finitions et la silhouette..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-gray-300 text-gray-900 focus:ring-0"
                />
                <label htmlFor="featured" className="text-gray-700 font-medium cursor-pointer">
                  Mettre en vedette dans la vitrine principale
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold transition-all shadow-sm"
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
