'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Eye,
  Shirt,
  MessageCircle,
  Inbox,
  Scissors,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '3m' | '12m'>('7d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [demands, setDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [resAnalytics, resDemands] = await Promise.all([
          fetch(`/api/analytics?period=${period}`),
          fetch('/api/demandes'),
        ]);
        const dataA = await resAnalytics.json();
        const dataD = await resDemands.json();
        setAnalytics(dataA);
        setDemands(Array.isArray(dataD) ? dataD : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [period]);

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center text-xs text-[#737373] tracking-widest uppercase">
        Chargement des métriques de la Maison...
      </div>
    );
  }

  const kpis = [
    {
      title: 'Visiteurs Uniques',
      value: analytics.totalVisitors.toLocaleString(),
      icon: Users,
      change: '+18.4%',
      sub: 'Trafic qualifié luxe',
    },
    {
      title: 'Pages & Créations Vues',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      change: '+24.1%',
      sub: 'Catalogue exploré',
    },
    {
      title: 'Clics WhatsApp Générés',
      value: analytics.totalWhatsAppClicks,
      icon: MessageCircle,
      change: '+32.8%',
      sub: 'Prospects chauds',
      highlight: true,
    },
    {
      title: 'Demandes Reçues (CRM)',
      value: analytics.totalDemands,
      icon: Inbox,
      change: '+15.2%',
      sub: `${analytics.bespokeDemands} sur-mesure`,
    },
    {
      title: 'Taux de Conversion WhatsApp',
      value: `${analytics.conversionRate}%`,
      icon: TrendingUp,
      change: '+4.2%',
      sub: 'Visiteurs convertis en contacts',
      gold: true,
    },
  ];

  const funnelData = [
    { name: '1. Visiteurs', count: analytics.totalVisitors },
    { name: '2. Vues Création', count: analytics.totalViews },
    { name: '3. Clic WhatsApp', count: analytics.totalWhatsAppClicks },
    { name: '4. Demandes CRM', count: analytics.totalDemands },
    { name: '5. Clients Confirmés', count: demands.filter(d => d.status === 'Confirmé' || d.status === 'Terminé').length },
  ];

  return (
    <div className="space-y-10">
      {/* Top Header & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="font-serif-luxe text-3xl text-white">
            Tableau de Bord & Performance
          </h1>
          <p className="text-xs text-[#737373] mt-1">
            Cockpit de mesure d'audience, conversion des prospects et suivi des créations.
          </p>
        </div>

        {/* Period Buttons */}
        <div className="flex items-center gap-1.5 bg-[#121212] p-1 border border-[#222222] rounded-sm text-xs">
          {[
            { key: 'today', label: "Aujourd'hui" },
            { key: '7d', label: '7 jours' },
            { key: '30d', label: '30 jours' },
            { key: '3m', label: '3 mois' },
            { key: '12m', label: '12 mois' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setPeriod(item.key as any)}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                period === item.key
                  ? 'bg-[#C5A880] text-black font-semibold'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {kpis.map((kpi) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`p-5 rounded-sm border transition-all ${
                kpi.highlight
                  ? 'bg-[#152419] border-[#25D366]/40'
                  : kpi.gold
                  ? 'bg-[#1A1813] border-[#C5A880]/40'
                  : 'bg-[#121212] border-[#222222]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium">
                  {kpi.title}
                </span>
                <IconComp className={`w-4 h-4 ${
                  kpi.highlight ? 'text-[#25D366]' : kpi.gold ? 'text-[#C5A880]' : 'text-[#737373]'
                }`} />
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <p className={`font-serif-luxe text-3xl font-bold ${
                  kpi.highlight ? 'text-[#25D366]' : kpi.gold ? 'text-[#C5A880]' : 'text-white'
                }`}>
                  {kpi.value}
                </p>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {kpi.change}
                </span>
              </div>

              <p className="text-[10px] text-[#737373] mt-1 truncate">
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Visits & WhatsApp Evolution Chart */}
        <div className="lg:col-span-8 p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxe text-xl text-white">
                Évolution des Visites & Clics WhatsApp
              </h3>
              <p className="text-xs text-[#737373]">
                Fréquentation quotidienne du site et conversion directe vers WhatsApp.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-[#D4D4D4]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880]" />
                <span>Pages Vues</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#D4D4D4]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                <span>WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.dailyVisits}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A880" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C5A880" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25D366" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#525252" fontSize={11} />
                <YAxis stroke="#525252" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#262626',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#C5A880"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#goldGrad)"
                  name="Pages Vues"
                />
                <Area
                  type="monotone"
                  dataKey="whatsapp"
                  stroke="#25D366"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#greenGrad)"
                  name="Clics WhatsApp"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources UTM Distribution */}
        <div className="lg:col-span-4 p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-6">
          <div>
            <h3 className="font-serif-luxe text-xl text-white">Sources de Trafic</h3>
            <p className="text-xs text-[#737373]">
              Attribution des visiteurs (Réseaux sociaux & Organique).
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.trafficSources}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {analytics.trafficSources.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#262626',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {analytics.trafficSources.map((source: any) => (
              <div key={source.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-[#D4D4D4]">{source.name}</span>
                </div>
                <span className="text-[#A3A3A3] font-mono">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel & Top Creations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Parcours de Conversion */}
        <div className="lg:col-span-6 p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-4">
          <div>
            <h3 className="font-serif-luxe text-xl text-white">
              Entonnoir de Conversion Visiteur → Client
            </h3>
            <p className="text-xs text-[#737373]">
              Visualisation des étapes franchies par les visiteurs jusqu'à la commande.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {funnelData.map((step, idx) => (
              <div key={step.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#D4D4D4]">{step.name}</span>
                  <span className="font-mono text-[#C5A880]">{step.count}</span>
                </div>
                <div className="w-full bg-[#181818] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C5A880]"
                    style={{
                      width: `${Math.max(10, Math.min(100, (step.count / (analytics.totalVisitors || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Creations Performance */}
        <div className="lg:col-span-6 p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxe text-xl text-white">
                Créations les Plus Consultées
              </h3>
              <p className="text-xs text-[#737373]">
                Les modèles générant le plus fort intérêt et clics WhatsApp.
              </p>
            </div>
            <Link
              href="/admin/creations"
              className="text-xs text-[#C5A880] hover:text-white uppercase tracking-wider"
            >
              Gérer
            </Link>
          </div>

          <div className="space-y-3">
            {analytics.topCreations.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-[#161616] border border-[#222222] rounded-sm text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-12 rounded-sm overflow-hidden bg-black shrink-0">
                    <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-medium line-clamp-1">{item.title}</p>
                    <p className="text-[#737373] text-[10px] font-mono">{item.ref} · {item.category}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[#C5A880] font-mono">{item.viewsCount} vues</p>
                  <p className="text-[#25D366] text-[10px] font-mono">{item.whatsappClicksCount} clics WA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini-CRM Recent Requests Quick Teaser */}
      <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-luxe text-xl text-white">Dernières Demandes Reçues (Mini-CRM)</h3>
            <p className="text-xs text-[#737373]">
              Interagissez directement avec les clients sur WhatsApp pour concrétiser les commandes.
            </p>
          </div>
          <Link
            href="/admin/demandes"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-[#d4af37]"
          >
            <span>Voir le CRM complet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#262626] text-[#737373] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Objet / Modèle</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Action WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {demands.slice(0, 4).map((d) => (
                <tr key={d.id} className="hover:bg-[#161616]">
                  <td className="py-3.5 px-4">
                    <p className="text-white font-medium">{d.fullName}</p>
                    <p className="text-[#737373] font-mono text-[10px]">{d.phone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize px-2 py-0.5 rounded-sm text-[10px] border border-white/10 bg-white/5">
                      {d.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#D4D4D4]">
                    {d.outfitType || d.creationTitle || 'Demande générale'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-sm text-[10px] border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880]">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`https://wa.me/${d.whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}?text=${encodeURIComponent(
                        `Bonjour ${d.fullName}, je fais suite à votre demande sur le site YANLAMODE Haute Couture.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-black font-semibold rounded-sm text-[10px] uppercase tracking-wider"
                    >
                      <MessageCircle className="w-3 h-3 fill-current" />
                      <span>Ouvrir WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
