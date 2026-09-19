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
import { Smartphone, Monitor, Tablet, Share2, Compass, ArrowUpRight } from 'lucide-react';

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
    return <div className="py-20 text-center text-xs text-[#737373]">Chargement des données de trafic...</div>;
  }

  const deviceData = [
    { name: 'Mobile', percent: 82, icon: Smartphone, color: '#C5A880' },
    { name: 'Desktop', percent: 14, icon: Monitor, color: '#9E9892' },
    { name: 'Tablette', percent: 4, icon: Tablet, color: '#525252' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="font-serif-luxe text-3xl text-white">Analytics Avancés & Sources de Trafic</h1>
          <p className="text-xs text-[#737373] mt-1">
            Traçabilité des campagnes réseaux sociaux, canaux de conversion et engagement sur le catalogue.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#121212] p-1 border border-[#222222] rounded-sm text-xs">
          {['7d', '30d', '3m'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                period === p ? 'bg-[#C5A880] text-black font-semibold' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {p === '7d' ? '7 derniers jours' : p === '30d' ? '30 derniers jours' : '3 derniers mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Sources & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trafic Réseaux Sociaux & UTM */}
        <div className="lg:col-span-8 p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxe text-xl text-white">Attribution par Réseau & Origine (UTM)</h3>
              <p className="text-xs text-[#737373]">
                Les canaux générant les visites les plus qualifiées vers WhatsApp.
              </p>
            </div>
            <span className="text-xs text-[#C5A880] flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>Priorité Mobile</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.trafficSources} layout="vertical">
                <XAxis type="number" stroke="#525252" fontSize={11} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#A3A3A3" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#262626',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="value" fill="#C5A880" radius={[0, 4, 4, 0]} name="Part de trafic (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices */}
        <div className="lg:col-span-4 p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-6">
          <div>
            <h3 className="font-serif-luxe text-xl text-white">Répartition Appareils</h3>
            <p className="text-xs text-[#737373]">
              82% des clients consultent YANLAMODE sur smartphone.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {deviceData.map((d) => {
              const IconComp = d.icon;
              return (
                <div key={d.name} className="p-4 bg-[#181818] border border-[#262626] rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComp className="w-5 h-5 text-[#C5A880]" />
                    <div>
                      <p className="text-white text-xs font-medium">{d.name}</p>
                      <p className="text-[#737373] text-[10px]">Optimisation priorité {d.name}</p>
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
      <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-6">
        <div>
          <h3 className="font-serif-luxe text-xl text-white">Palmarès de Conversion par Création</h3>
          <p className="text-xs text-[#737373]">
            Rapport entre nombre d’affichages et clics sur « Commander sur WhatsApp ».
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#262626] text-[#737373] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Modèle</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4 text-center">Consultations</th>
                <th className="py-3 px-4 text-center">Clics WhatsApp</th>
                <th className="py-3 px-4 text-center">Taux d'Intérêt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {analytics.topCreations.map((item: any) => {
                const interestRate = ((item.whatsappClicksCount / (item.viewsCount || 1)) * 100).toFixed(1);
                return (
                  <tr key={item.id} className="hover:bg-[#161616]">
                    <td className="py-3 px-4 font-medium text-white">{item.title}</td>
                    <td className="py-3 px-4 text-[#A3A3A3]">{item.category}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#D4D4D4]">{item.viewsCount}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#25D366] font-semibold">{item.whatsappClicksCount}</td>
                    <td className="py-3 px-4 text-center">
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
