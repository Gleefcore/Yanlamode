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
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Smartphone, Monitor, Tablet, Share2, Compass, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '3m'>('7d');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/analytics?period=${period}`);
        const data = await res.json();
        setAnalytics(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [period]);

  if (!analytics) {
    return (
      <div className="py-24 text-center text-xs text-zinc-500 bg-[#0E0E12] border border-white/[0.08] rounded-sm">
        Chargement des métriques d’audience et de conversion...
      </div>
    );
  }

  const deviceData = [
    { name: 'Mobile', percent: 82, icon: Smartphone, color: '#C5A880' },
    { name: 'Desktop', percent: 14, icon: Monitor, color: '#A1A1AA' },
    { name: 'Tablette', percent: 4, icon: Tablet, color: '#52525B' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
              Performance Commerciale
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono text-zinc-400">
              Canaux d'Acquisition
            </span>
          </div>
          <h1 className="font-serif-luxe text-3xl sm:text-4xl text-white tracking-wide mt-1">
            Analytics & Conversion WhatsApp
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
            Traçabilité des campagnes réseaux sociaux, canaux de conversion et engagement sur le catalogue haute couture.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0E0E12] p-1 border border-white/[0.08] rounded-sm text-xs">
          {['7d', '30d', '3m'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-3 py-1.5 rounded-sm transition-all text-[11px] uppercase tracking-wider ${
                period === p ? 'bg-[#C5A880] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p === '7d' ? '7 Jours' : p === '30d' ? '30 Jours' : '3 Mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Sources & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trafic Réseaux Sociaux & UTM */}
        <div className="lg:col-span-8 p-6 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                Sources de Visites (Attribution)
              </span>
              <h3 className="font-serif-luxe text-xl text-white mt-0.5">
                Origine du Trafic Qualifié
              </h3>
            </div>
            <span className="text-xs text-[#C5A880] flex items-center gap-1.5 bg-[#C5A880]/10 border border-[#C5A880]/30 px-2.5 py-1 rounded-sm">
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Instagram & WhatsApp Top</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.trafficSources} layout="vertical">
                <XAxis type="number" stroke="#52525B" fontSize={11} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#A1A1AA" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141418',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#C5A880" radius={[0, 4, 4, 0]} name="Part de trafic (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices */}
        <div className="lg:col-span-4 p-6 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-6 shadow-xl">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Supports Clients
            </span>
            <h3 className="font-serif-luxe text-xl text-white mt-0.5">
              Répartition des Écrans
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-1">
              82% des clients consultent YANLAMODE sur smartphone lors des essayages.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {deviceData.map((d) => {
              const IconComp = d.icon;
              return (
                <div key={d.name} className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-sm flex items-center justify-between hover:border-white/[0.15] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-sm">
                      <IconComp className="w-4 h-4 text-[#C5A880]" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">{d.name}</p>
                      <p className="text-zinc-500 text-[10px]">{d.name === 'Mobile' ? 'Expérience tactile prioritaire' : 'Consultation atelier'}</p>
                    </div>
                  </div>
                  <span className="font-serif-luxe text-xl text-[#C5A880] font-bold">
                    {d.percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Performance par modèle */}
      <div className="p-6 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Attractivité & Taux de Clavier
            </span>
            <h3 className="font-serif-luxe text-xl text-white mt-0.5">
              Palmarès de Conversion par Silhouette
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-light">
            Ratio : Clics « Commander » / Consultations Fiche
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] tracking-[0.2em]">
              <tr>
                <th className="py-3.5 px-4 font-normal">Modèle</th>
                <th className="py-3.5 px-4 font-normal">Ligne</th>
                <th className="py-3.5 px-4 text-center font-normal">Consultations</th>
                <th className="py-3.5 px-4 text-center font-normal">Commandes WhatsApp</th>
                <th className="py-3.5 px-4 text-center font-normal">Taux d'Intérêt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {analytics.topCreations.map((item: any) => {
                const interestRate = ((item.whatsappClicksCount / (item.viewsCount || 1)) * 100).toFixed(1);
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{item.title}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{item.category}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-zinc-300">{item.viewsCount}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#25D366] font-semibold">{item.whatsappClicksCount}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880] font-mono">
                        {interestRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
