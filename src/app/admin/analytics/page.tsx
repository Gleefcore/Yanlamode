'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ShoppingBag, Users, PhoneCall, Calendar } from 'lucide-react';
import { Demand } from '@/lib/types';

const COLORS = ['#8C6D42', '#374151', '#D1D5DB', '#F59E0B', '#10B981'];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [period, setPeriod] = useState<'7d' | '30d' | '3m'>('7d');
  
  useEffect(() => {
    async function load() {
      try {
        const [resAna, resDemands] = await Promise.all([
          fetch(`/api/analytics?period=${period}`),
          fetch('/api/demandes')
        ]);
        const dataAna = await resAna.json();
        const dataDemands = await resDemands.json();
        setAnalytics(dataAna);
        setDemands(Array.isArray(dataDemands) ? dataDemands : []);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [period]);

  if (!analytics) {
    return (
      <div className="py-24 text-center text-xs text-gray-400 bg-white border border-gray-200/70 rounded-2xl">
        Chargement des statistiques...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Statistiques & Suivi des Commandes WhatsApp
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Visualisez le nombre exact de commandes générées depuis le site et consultez les noms des clients.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Commandes</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalDemands}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Formations</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.formationDemands || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F3EFEA] flex items-center justify-center">
            <PhoneCall className="w-6 h-6 text-[#8C6D42]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Clics WhatsApp</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalWhatsAppClicks}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Vues Catalogue</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Évolution des Commandes</h3>
          {analytics.orderEvolution && analytics.orderEvolution.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.orderEvolution}>
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="count" fill="#8C6D42" radius={[4, 4, 0, 0]} name="Commandes reçues" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-sm text-gray-500">Pas encore de données pour le graphique.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Répartition par Statut</h3>
          {analytics.demandsByStatus && analytics.demandsByStatus.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.demandsByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.demandsByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-sm text-gray-500">Aucune commande pour afficher la répartition.</p>
            </div>
          )}
        </div>
      </div>

      {/* Liste des Commandes */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Historique des Commandes Clients</h3>
          <p className="text-xs text-gray-500">
            Noms, contacts et types de commandes générées depuis le site vers WhatsApp.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Nom du Client</th>
                <th className="py-3.5 px-4 font-semibold">Contact</th>
                <th className="py-3.5 px-4 font-semibold">Type / Demande</th>
                <th className="py-3.5 px-4 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demands.length > 0 ? demands.map((demand) => (
                <tr key={demand.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{demand.fullName}</td>
                  <td className="py-3.5 px-4 text-gray-600">{demand.whatsapp}</td>
                  <td className="py-3.5 px-4 text-gray-600">{demand.outfitType || demand.creationTitle || (demand.type === 'formation' ? 'Inscription Formation' : 'Sur-mesure')}</td>
                  <td className="py-3.5 px-4 text-right text-gray-500">
                    {new Date(demand.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">Aucune commande enregistrée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
