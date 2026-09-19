'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Smartphone, Monitor, Tablet, Share2, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

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
      <div className="py-24 text-center text-xs text-gray-400 bg-white border border-gray-200/70 rounded-2xl">
        Chargement des analytics d'audience...
      </div>
    );
  }

  const deviceData = [
    { name: 'Mobile', percent: 82, icon: Smartphone, color: '#F59E0B' },
    { name: 'Desktop', percent: 14, icon: Monitor, color: '#6B7280' },
    { name: 'Tablette', percent: 4, icon: Tablet, color: '#9CA3AF' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Analytics & Conversion WhatsApp
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Traçabilité des campagnes réseaux sociaux, canaux de conversion et engagement sur les silhouettes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-50 p-1 border border-gray-200 rounded-xl text-xs font-semibold">
          {['7d', '30d', '3m'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === p ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p === '7d' ? '7 Jours' : p === '30d' ? '30 Jours' : '3 Mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Sources & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trafic Réseaux Sociaux & UTM */}
        <div className="lg:col-span-8 p-6 bg-white border border-gray-200/70 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Origine du Trafic Qualifié</h3>
              <p className="text-xs text-gray-500">
                Canaux générant le plus de consultations et d'ouvertures de salon.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Priorité Mobile</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.trafficSources} layout="vertical">
                <XAxis type="number" stroke="#9CA3AF" fontSize={11} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#4B5563" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #E5E7EB',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="value" fill="#F59E0B" radius={[0, 6, 6, 0]} name="Part de trafic (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices */}
        <div className="lg:col-span-4 p-6 bg-white border border-gray-200/70 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Appareils Clients</h3>
            <p className="text-xs text-gray-500">
              82% des clients consultent YANLAMODE sur smartphone.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {deviceData.map((d) => {
              const IconComp = d.icon;
              return (
                <div key={d.name} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-2xs">
                      <IconComp className="w-4 h-4 text-gray-800" />
                    </div>
                    <div>
                      <p className="text-gray-900 text-xs font-bold">{d.name}</p>
                      <p className="text-gray-500 text-[10px]">{d.name === 'Mobile' ? 'Expérience tactile prioritaire' : 'Consultation bureau'}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {d.percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Performance par modèle */}
      <div className="p-6 bg-white border border-gray-200/70 rounded-2xl shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Palmarès de Conversion par Silhouette</h3>
          <p className="text-xs text-gray-500">
            Rapport entre nombre d'affichages et clics sur « Commander ».
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Modèle</th>
                <th className="py-3.5 px-4 font-semibold">Ligne</th>
                <th className="py-3.5 px-4 text-center font-semibold">Consultations</th>
                <th className="py-3.5 px-4 text-center font-semibold">Commandes WhatsApp</th>
                <th className="py-3.5 px-4 text-center font-semibold">Taux d'Intérêt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics.topCreations.map((item: any) => {
                const interestRate = ((item.whatsappClicksCount / (item.viewsCount || 1)) * 100).toFixed(1);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{item.title}</td>
                    <td className="py-3.5 px-4 text-gray-600">{item.category}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-gray-700">{item.viewsCount}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-600 font-bold">{item.whatsappClicksCount}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
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
