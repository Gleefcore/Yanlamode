'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Shirt,
  MessageCircle,
  Eye,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Demand, Creation } from '@/lib/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentDemands, setRecentDemands] = useState<Demand[]>([]);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('Ce Mois');
  const [searchQuick, setSearchQuick] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [resStats, resDemands, resCreations] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/demandes'),
        fetch('/api/creations'),
      ]);
      const dataStats = await resStats.json();
      const dataDemands = await resDemands.json();
      const dataCreations = await resCreations.json();

      setStats(dataStats);
      setRecentDemands(Array.isArray(dataDemands) ? dataDemands.slice(0, 5) : []);
      setCreations(Array.isArray(dataCreations) ? dataCreations : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Activity Curve Data (Knowvio smooth golden wave)
  const activityData = [
    { day: '1', visits: 35, orders: 4 },
    { day: '5', visits: 48, orders: 7 },
    { day: '10', visits: 62, orders: 12 },
    { day: '15', visits: 85, orders: 18 },
    { day: '20', visits: 72, orders: 14 },
    { day: '25', visits: 96, orders: 22 },
    { day: '30', visits: 115, orders: 29 },
  ];

  // Donut Data for Destinations / Channels (Knowvio Split)
  const splitData = [
    { name: 'Cameroun (Douala, Yaoundé)', value: 45, color: '#F59E0B' },
    { name: 'Europe (France, Belgique...)', value: 30, color: '#3B82F6' },
    { name: 'Canada (Montréal, Toronto)', value: 25, color: '#EC4899' },
  ];

  const totalSilhouettes = creations.length || 10;
  const totalDemands = recentDemands.length || 42;
  const conversionRate = '88%';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Highlights Section (Knowvio Top Row) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Highlights</h3>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Silhouettes au Catalogue */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Shirt className="w-4 h-4 text-gray-700" />
                <span>Pièces Catalogue</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +12%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900 font-sans">
                {String(totalSilhouettes).padStart(2, '0')}
              </span>
              {/* Mini Sparkline Bar Chart */}
              <div className="flex items-end gap-1 h-6">
                <div className="w-1.5 bg-amber-200 rounded-t h-2" />
                <div className="w-1.5 bg-amber-300 rounded-t h-3.5" />
                <div className="w-1.5 bg-amber-400 rounded-t h-5" />
                <div className="w-1.5 bg-[#F59E0B] rounded-t h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Demandes Reçues */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <MessageCircle className="w-4 h-4 text-gray-700" />
                <span>Demandes Atelier</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +5%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900 font-sans">
                {String(totalDemands).padStart(2, '0')}
              </span>
              {/* Mini Sparkline Line Curve */}
              <div className="flex items-center text-amber-500">
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Card 3: Taux de Conversion */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Sparkles className="w-4 h-4 text-gray-700" />
                <span>Conversion VIP</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +10%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900 font-sans">
                {conversionRate}
              </span>
              {/* Mini Curve indicator */}
              <div className="w-12 h-6 flex items-end">
                <svg viewBox="0 0 50 20" className="w-full h-full text-amber-500 fill-none stroke-current stroke-2">
                  <path d="M 0 18 Q 20 15 30 5 T 50 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Suivi Continu (Streak) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Clock className="w-4 h-4 text-gray-700" />
                <span>Livraisons Actives</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +8%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900 font-sans">07</span>
                <span className="text-xs text-gray-500 font-medium">Jours</span>
              </div>
              {/* 4 Colored dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Progress Overview (Area Chart) + Weekly Activity Split (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Overview (Knowvio Golden Area Chart) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Progress Overview</h3>
              <p className="text-xs text-gray-500">
                Évolution des visites qualifiées et commandes vers WhatsApp.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                <span>Haute Couture</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                <span>Ce mois</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Area Chart with Warm Golden Gradient */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="knowvioGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #E5E7EB',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val} actions`, 'Intérêt']}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#knowvioGold)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Split (Knowvio Donut Chart) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Zones de Livraison</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Split
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Répartition géographique des commandes clients.
            </p>
          </div>

          {/* Donut with Center Total */}
          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={splitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {splitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold text-gray-400">Total</span>
              <span className="text-xl font-bold text-gray-900">58</span>
            </div>
          </div>

          {/* Legend dots */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {splitData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 truncate max-w-[170px]">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Upcoming Deadlines (CRM Table) + Quick Review (Express Studio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upcoming Deadlines (Knowvio Table Style) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Dernières Demandes & Rendez-vous</h3>
              <p className="text-xs text-gray-500">
                Suivi des commandes en cours de fabrication dans l'atelier.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/demandes"
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors inline-flex items-center gap-1"
              >
                <span>Voir Tout ({recentDemands.length})</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Client & Projet</th>
                  <th className="pb-3 font-semibold">Date Cible</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold text-right">Priorité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDemands.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Aucune commande en attente.
                    </td>
                  </tr>
                ) : (
                  recentDemands.map((item, idx) => {
                    const statusColor =
                      item.status === 'Nouveau'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : item.status === 'Confirmé'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200';

                    const dotColor = idx % 2 === 0 ? 'bg-amber-500' : 'bg-blue-500';

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                            <div>
                              <p className="font-semibold text-gray-900">{item.fullName}</p>
                              <p className="text-[11px] text-gray-500 truncate max-w-xs font-light">
                                {item.outfitType || item.creationTitle || 'Tenue d’apparat'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3.5 text-gray-600 font-medium">
                          {item.type === 'sur-mesure' ? 'Sur-Mesure' : 'Catalogue'}
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="font-bold text-gray-800 text-[11px]">
                            {idx === 0 ? 'High' : 'Medium'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Review / Accès Rapide (Knowvio Style Right Card) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Accès Rapide Studio</h3>
            <p className="text-xs text-gray-500">
              Rechercher une silhouette et lancer une commande WhatsApp.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une pièce..."
              value={searchQuick}
              onChange={(e) => setSearchQuick(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-900"
            />
          </div>

          {/* Quick pill tags */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Modèles Récents</span>
            <div className="flex flex-wrap gap-1.5">
              {creations.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/creations/${c.slug}`}
                  target="_blank"
                  className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] text-gray-700 transition-colors"
                >
                  {c.title.split(' ')[0]} {c.title.split(' ')[1]}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/admin/creations"
              className="flex-1 text-center py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Gérer Catalogue
            </Link>
            <Link
              href="/admin/demandes"
              className="flex-1 text-center py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Ouvrir CRM →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
