'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shirt,
  MessageCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Settings,
  ChevronRight,
  Package,
} from 'lucide-react';
import { Demand, Creation } from '@/lib/types';

export default function AdminDashboardPage() {
  const [recentDemands, setRecentDemands] = useState<Demand[]>([]);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [resDemands, resCreations] = await Promise.all([
        fetch('/api/demandes'),
        fetch('/api/creations'),
      ]);
      const dataDemands = await resDemands.json();
      const dataCreations = await resCreations.json();

      setRecentDemands(Array.isArray(dataDemands) ? dataDemands.slice(0, 5) : []);
      setCreations(Array.isArray(dataCreations) ? dataCreations : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* 1. Header de bienvenue ultra-simple */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/70 shadow-sm">
        <h1 className="font-serif-luxe text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Bonjour, bienvenue dans votre atelier.
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
          C'est ici que vous gérez vos créations, consultez les demandes de vos clients, et configurez les informations de votre site vitrine. Que souhaitez-vous faire aujourd'hui ?
        </p>
      </div>

      {/* 2. Actions Rapides (Gros boutons intuitifs) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/admin/creations"
          className="group flex flex-col items-center text-center bg-gray-900 hover:bg-black text-white p-6 rounded-2xl shadow-md transition-all hover:scale-[1.02]"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-1">Ajouter un Modèle</h3>
          <p className="text-gray-300 text-xs">Mettez en ligne une nouvelle création avec sa photo.</p>
        </Link>

        <Link
          href="/admin/demandes"
          className="group flex flex-col items-center text-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 p-6 rounded-2xl shadow-sm transition-all hover:scale-[1.02]"
        >
          <div className="w-12 h-12 bg-[#F3EFEA] rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-[#8C6D42]" />
          </div>
          <h3 className="font-bold text-lg mb-1">Voir les Commandes</h3>
          <p className="text-gray-500 text-xs">Consultez les clients qui vous ont contacté.</p>
        </Link>

        <Link
          href="/admin/parametres"
          className="group flex flex-col items-center text-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 p-6 rounded-2xl shadow-sm transition-all hover:scale-[1.02]"
        >
          <div className="w-12 h-12 bg-[#F3EFEA] rounded-full flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-[#8C6D42]" />
          </div>
          <h3 className="font-bold text-lg mb-1">Modifier le Site</h3>
          <p className="text-gray-500 text-xs">Changer votre numéro WhatsApp ou vos textes.</p>
        </Link>
      </div>

      {/* 3. Résumé de l'activité - Très visuel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Dernières Commandes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F3EFEA] rounded-lg">
                <Clock className="w-5 h-5 text-[#8C6D42]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Dernières Demandes</h2>
            </div>
            <Link href="/admin/demandes" className="text-sm font-semibold text-[#8C6D42] hover:underline">
              Tout voir
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {loading ? (
              <p className="text-gray-400 text-sm text-center py-4">Chargement...</p>
            ) : recentDemands.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                Aucune demande pour le moment.
              </p>
            ) : (
              recentDemands.map((demand) => (
                <div key={demand.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-bold text-gray-900">{demand.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{demand.outfitType || demand.creationTitle || 'Tenue sur-mesure'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold ${
                      demand.status === 'Nouveau' ? 'bg-amber-100 text-amber-800' : 
                      demand.status === 'Confirmé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {demand.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(demand.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Aperçu du Catalogue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F3EFEA] rounded-lg">
                <Shirt className="w-5 h-5 text-[#8C6D42]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Votre Catalogue</h2>
            </div>
            <Link href="/admin/creations" className="text-sm font-semibold text-[#8C6D42] hover:underline">
              Tout voir
            </Link>
          </div>

          <div className="mb-4">
            <p className="text-3xl font-extrabold text-gray-900">{creations.length}</p>
            <p className="text-sm text-gray-500">modèles actuellement en vitrine</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {loading ? (
              <p className="text-gray-400 text-sm col-span-full py-4 text-center">Chargement...</p>
            ) : creations.slice(0, 4).map((c) => (
              <div key={c.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
                <Image src={c.images[0] || '/images/placeholder.jpg'} alt={c.title} fill className="object-cover" />
              </div>
            ))}
          </div>

          <Link
            href="/admin/creations"
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-sm transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Gérer tous mes vêtements</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
