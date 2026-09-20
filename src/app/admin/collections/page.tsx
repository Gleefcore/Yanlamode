'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collection } from '@/lib/types';
import { Layers, ArrowRight, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    season: '',
    coverImage: '',
    featured: false,
  });

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

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

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      season: 'Collection Permanente',
      coverImage: '',
      featured: false,
    });
    setImagePreview(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Collection) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      season: c.season || '',
      coverImage: c.coverImage || '',
      featured: c.featured || false,
    });
    setImagePreview(c.coverImage || null);
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
        setForm(prev => ({ ...prev, coverImage: data.url }));
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

    const payload = {
      title: form.title,
      slug,
      description: form.description,
      season: form.season,
      coverImage: form.coverImage,
      featured: form.featured,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/collections/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchCollections();
          setModalOpen(false);
        }
      } else {
        const res = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchCollections();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Confirmer la suppression de la collection "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCollections(collections.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

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

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-700" />
            <span>{collections.length} Lignes Répertoriées</span>
          </span>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Collection</span>
          </button>
        </div>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-6 bg-white border border-gray-200/70 rounded-2xl flex gap-6 items-start hover:shadow-md transition-all duration-200 group relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-gray-200 shadow-sm z-20">
              <button
                onClick={() => handleOpenEdit(col)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Modifier"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(col.id, col.title)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-sm">
              <Image
                src={col.coverImage || '/images/placeholder.jpg'}
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
                  {col.creationsCount || 0} créations rattachées
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
        {collections.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 border-dashed">
            Aucune collection existante. Cliquez sur "Nouvelle Collection" pour commencer.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Modifier la Collection' : 'Ajouter une Collection'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Nom de la collection *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-gray-900 transition-colors"
                    placeholder="Ex: Héritage & Tradition"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Saison / Période *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.season}
                    onChange={(e) => setForm({ ...form, season: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-gray-900 transition-colors"
                    placeholder="Ex: Édition Permanente"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Description Éditoriale *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-gray-900 transition-colors resize-none"
                    placeholder="Décrivez l'inspiration de la collection..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Téléverser une image de couverture *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors overflow-hidden group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-8 flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
                      {imagePreview ? (
                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-gray-900 transition-colors">
                            <Upload className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-semibold text-gray-600 mt-2">
                            {uploading ? 'Téléchargement...' : 'Glissez ou cliquez pour ajouter une image'}
                          </p>
                          <p className="text-[10px] text-gray-400">PNG, JPG ou WEBP (Max. 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                  />
                  <label htmlFor="featured" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                    Mettre en avant sur la page d'accueil
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <span>{editingId ? 'Enregistrer les modifications' : 'Ajouter la collection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
