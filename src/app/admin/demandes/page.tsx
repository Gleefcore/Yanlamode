'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Demand, DemandStatus } from '@/lib/types';
import { MessageCircle, Search, Filter, Clock, CheckCircle2, User, Phone, Mail, Calendar, DollarSign, FileText, Sparkles, Send, ArrowUpRight } from 'lucide-react';

const STATUS_LIST: DemandStatus[] = [
  'Nouveau',
  'En discussion',
  'Devis / Proposition',
  'Confirmé',
  'Terminé',
];

export default function AdminDemandesCRMPage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [search, setSearch] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemands();
  }, []);

  async function fetchDemands() {
    try {
      const res = await fetch('/api/demandes');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setDemands(list);
      if (list.length > 0 && !selectedDemand) {
        setSelectedDemand(list[0]);
        setNotesDraft(list[0].notes || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectDemand = (d: Demand) => {
    setSelectedDemand(d);
    setNotesDraft(d.notes || '');
  };

  const handleUpdateStatus = async (status: DemandStatus) => {
    if (!selectedDemand) return;
    try {
      const res = await fetch('/api/demandes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedDemand.id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedDemand(updated);
        setDemands(demands.map(d => d.id === updated.id ? updated : d));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedDemand) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/demandes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDemand.id,
          status: selectedDemand.status,
          notes: notesDraft,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedDemand(updated);
        setDemands(demands.map(d => d.id === updated.id ? updated : d));
        alert('Notes confidentielles de l’atelier enregistrées.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNotes(false);
    }
  };

  const filtered = demands.filter((d) => {
    const matchesStatus = filterStatus === 'Tous' || d.status === filterStatus;
    const matchesSearch =
      search === '' ||
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      (d.outfitType && d.outfitType.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const nouveauCount = demands.filter(d => d.status === 'Nouveau').length;
  const enDiscussionCount = demands.filter(d => d.status === 'En discussion').length;
  const confirmeCount = demands.filter(d => d.status === 'Confirmé').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
              Conciergerie & Salon Privé
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono text-zinc-400">
              Pipeline VIP
            </span>
          </div>
          <h1 className="font-serif-luxe text-3xl sm:text-4xl text-white tracking-wide mt-1">
            Demandes & Commandes Sur-Mesure
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
            Pilotez les commandes privées, échangez directement avec les clients sur WhatsApp et archivez les mensurations d'atelier.
          </p>
        </div>

        {/* Status Counter Chips */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-[#0E0E12] border border-white/[0.08] rounded-sm text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">{nouveauCount} nouvelle(s)</span>
          </div>
          <div className="px-3.5 py-1.5 bg-[#0E0E12] border border-[#C5A880]/30 rounded-sm text-xs flex items-center gap-2 text-[#C5A880]">
            <span className="font-mono font-bold">{confirmeCount}</span>
            <span>Confirmée(s)</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0E0E12] p-4 rounded-sm border border-white/[0.08]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('Tous')}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
              filterStatus === 'Tous'
                ? 'bg-[#C5A880] text-black font-semibold shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.05]'
            }`}
          >
            Toutes ({demands.length})
          </button>
          {STATUS_LIST.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-[#C5A880] text-black font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {st} ({demands.filter(d => d.status === st).length})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher par client, tél..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] transition-colors"
          />
        </div>
      </div>

      {/* Main CRM split view: List on left, Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Demand list */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-[#0E0E12] border border-white/[0.08] rounded-sm">
              Chargement des dossiers clients...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-[#0E0E12] border border-white/[0.08] rounded-sm">
              Aucune demande enregistrée dans ce filtre.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedDemand?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectDemand(item)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all duration-300 space-y-2.5 ${
                    isSelected
                      ? 'bg-[#14141A] border-[#C5A880] shadow-lg shadow-black/40 ring-1 ring-[#C5A880]/30'
                      : 'bg-[#0E0E12] border-white/[0.08] hover:border-white/[0.2] hover:bg-[#121216]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{item.fullName}</span>
                      {item.status === 'Nouveau' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#C5A880] font-medium text-[11px] truncate max-w-[200px]">
                      {item.outfitType || item.creationTitle || 'Projet Sur-Mesure'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider border ${
                      item.status === 'Nouveau'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                        : item.status === 'Confirmé'
                        ? 'border-[#C5A880]/30 text-[#C5A880] bg-[#C5A880]/10'
                        : 'border-white/10 text-zinc-400 bg-white/[0.02]'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-1 font-light">
                    {item.description}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Demand Inspector Panel */}
        <div className="lg:col-span-7 bg-[#0E0E12] border border-white/[0.08] rounded-sm p-6 sm:p-8 space-y-8 shadow-2xl">
          {selectedDemand ? (
            <div className="space-y-8">
              {/* Header with WhatsApp Direct Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                      Dossier Client Privé #{selectedDemand.id}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                      {selectedDemand.type === 'sur-mesure' ? 'Sur-Mesure Haute Couture' : 'Commande Vitrine'}
                    </span>
                  </div>
                  <h2 className="font-serif-luxe text-2xl sm:text-3xl text-white mt-1">
                    {selectedDemand.fullName}
                  </h2>
                </div>

                {/* Direct WhatsApp Action Button */}
                <a
                  href={`https://wa.me/${selectedDemand.whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}?text=${encodeURIComponent(
                    `Bonjour ${selectedDemand.fullName}, c'est l'atelier YANLAMODE Haute Couture. Nous faisons suite à votre demande concernant : ${selectedDemand.outfitType || selectedDemand.creationTitle || 'votre projet de création'}. Nos artisans sont à votre disposition pour concrétiser votre silhouette.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-black font-semibold text-xs uppercase tracking-[0.14em] rounded-sm hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Échanger sur WhatsApp</span>
                </a>
              </div>

              {/* Status Pipeline Buttons */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 block">
                  Faire Évoluer le Statut de Commande :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STATUS_LIST.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2.5 py-2 text-[10px] uppercase tracking-wider rounded-sm border transition-all text-center ${
                        selectedDemand.status === st
                          ? 'bg-[#C5A880] text-black font-bold border-[#C5A880] shadow-md shadow-[#C5A880]/15'
                          : 'bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white hover:border-white/[0.2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white/[0.02] p-4 rounded-sm border border-white/[0.08]">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-1">Téléphone & WhatsApp</span>
                  <a href={`tel:${selectedDemand.phone}`} className="text-white hover:text-[#C5A880] font-mono transition-colors">
                    {selectedDemand.phone}
                  </a>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-1">Courriel</span>
                  <span className="text-zinc-200">{selectedDemand.email || 'Non renseigné'}</span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-1">Événement & Date Cible</span>
                  <span className="text-zinc-200">{selectedDemand.occasion || 'Non précisé'}</span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-1">Budget Estimé Client</span>
                  <span className="text-[#C5A880] font-medium">{selectedDemand.budget || 'À définir lors du premier essayage'}</span>
                </div>
              </div>

              {/* Mensurations Details */}
              {selectedDemand.measurements && Object.values(selectedDemand.measurements).some(Boolean) && (
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                    Relevé de Mensurations Atelier
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {Object.entries(selectedDemand.measurements).map(([key, val]) => (
                      val ? (
                        <div key={key} className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-sm text-center">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 capitalize block mb-0.5">{key}</span>
                          <span className="text-white font-mono font-medium">{val} cm</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {/* Description & Inspiration photo */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  Cahier des Charges & Demande Détaillée
                </h4>
                <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-sm text-xs text-zinc-300 leading-relaxed font-light">
                  {selectedDemand.description}
                </div>

                {selectedDemand.inspirationImages && selectedDemand.inspirationImages.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] text-zinc-400">Photo d’inspiration transmise par le client :</span>
                    <div className="relative w-40 h-52 rounded-sm overflow-hidden border border-[#C5A880]/60 shadow-lg">
                      <Image
                        src={selectedDemand.inspirationImages[0]}
                        alt="Inspiration client"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Notes / Couturier Diary */}
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                    Carnet Confidentiel du Maître Couturier
                  </h4>
                  <span className="text-[10px] text-zinc-500">Visible uniquement en interne</span>
                </div>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Notes de rendez-vous, référence des rouleaux de tissu réservés, acompte perçu, date de retouche..."
                  className="w-full p-3 bg-white/[0.04] border border-white/[0.08] rounded-sm text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] leading-relaxed transition-colors"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs uppercase tracking-wider rounded-sm transition-all disabled:opacity-50"
                >
                  {savingNotes ? 'Enregistrement en cours...' : 'Enregistrer dans le carnet d’atelier'}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-zinc-500">
              Sélectionnez une demande dans la liste de gauche pour afficher le dossier client complet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
