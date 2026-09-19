'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Demand, DemandStatus } from '@/lib/types';
import { MessageCircle, Search, Filter, Clock, CheckCircle2, User, Phone, Mail, Calendar, DollarSign, FileText } from 'lucide-react';

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
        alert('Notes internes enregistrées avec succès !');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="font-serif-luxe text-3xl text-white">
            Mini-CRM & Suivi des Demandes
          </h1>
          <p className="text-xs text-[#737373] mt-1">
            Gérez vos opportunités commerciales, échangez sur WhatsApp et suivez l’état d’avancement de chaque commande.
          </p>
        </div>

        {/* Counter pill */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880] text-xs rounded-sm font-medium">
            {demands.length} demande(s) au total
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#121212] p-4 rounded-sm border border-[#222222]">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('Tous')}
            className={`px-3 py-1.5 text-xs rounded-sm transition-all whitespace-nowrap ${
              filterStatus === 'Tous'
                ? 'bg-[#C5A880] text-black font-semibold'
                : 'bg-[#181818] text-[#A3A3A3] hover:text-white'
            }`}
          >
            Tous ({demands.length})
          </button>
          {STATUS_LIST.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs rounded-sm transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-[#C5A880] text-black font-semibold'
                  : 'bg-[#181818] text-[#A3A3A3] hover:text-white'
              }`}
            >
              {st} ({demands.filter(d => d.status === st).length})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#181818] border border-[#262626] rounded-sm text-xs text-white placeholder-[#737373] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Main CRM split view: List on left, Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Demand list */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#737373]">Chargement des demandes...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#737373]">Aucune demande trouvée.</div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedDemand?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectDemand(item)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-[#181818] border-[#C5A880] ring-1 ring-[#C5A880]/30'
                      : 'bg-[#121212] border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">{item.fullName}</span>
                    <span className="text-[10px] text-[#737373]">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#C5A880] font-medium text-[11px] truncate max-w-[180px]">
                      {item.outfitType || item.creationTitle || 'Demande générale'}
                    </span>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] border border-white/10 bg-white/5 text-[#D4D4D4]">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#737373] line-clamp-1">
                    {item.description}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Demand Inspector Panel */}
        <div className="lg:col-span-7 bg-[#121212] border border-[#222222] rounded-sm p-6 sm:p-8 space-y-8">
          {selectedDemand ? (
            <div className="space-y-8">
              {/* Header with WhatsApp Direct Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-[#C5A880]">
                      Demande #{selectedDemand.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/10 text-white">
                      {selectedDemand.type}
                    </span>
                  </div>
                  <h2 className="font-serif-luxe text-2xl sm:text-3xl text-white mt-1">
                    {selectedDemand.fullName}
                  </h2>
                </div>

                {/* Direct WhatsApp Call to Action */}
                <a
                  href={`https://wa.me/${selectedDemand.whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}?text=${encodeURIComponent(
                    `Bonjour ${selectedDemand.fullName}, c'est l'atelier YANLAMODE Haute Couture. Je vous contacte concernant votre demande pour : ${selectedDemand.outfitType || selectedDemand.creationTitle || 'votre projet de création'}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-[#20bd5a] transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Échanger sur WhatsApp</span>
                </a>
              </div>

              {/* Status Pipeline Buttons */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#737373]">
                  Faire avancer le statut de la commande :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STATUS_LIST.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2.5 py-2 text-[10px] uppercase tracking-wider rounded-sm border transition-all text-center ${
                        selectedDemand.status === st
                          ? 'bg-[#C5A880] text-black font-bold border-[#C5A880]'
                          : 'bg-[#181818] text-[#A3A3A3] border-[#262626] hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#161616] p-4 rounded-sm border border-[#262626]">
                <div>
                  <span className="text-[#737373] block mb-0.5">Téléphone / WhatsApp</span>
                  <a href={`tel:${selectedDemand.phone}`} className="text-white hover:text-[#C5A880] font-mono">
                    {selectedDemand.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[#737373] block mb-0.5">Email</span>
                  <span className="text-white">{selectedDemand.email || 'Non renseigné'}</span>
                </div>

                <div>
                  <span className="text-[#737373] block mb-0.5">Événement & Date</span>
                  <span className="text-[#D4D4D4]">{selectedDemand.occasion || 'Non précisé'}</span>
                </div>

                <div>
                  <span className="text-[#737373] block mb-0.5">Budget Estimé</span>
                  <span className="text-[#C5A880] font-medium">{selectedDemand.budget || 'À définir'}</span>
                </div>
              </div>

              {/* Mensurations Details */}
              {selectedDemand.measurements && Object.values(selectedDemand.measurements).some(Boolean) && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                    Mensurations transmises
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {Object.entries(selectedDemand.measurements).map(([key, val]) => (
                      val ? (
                        <div key={key} className="p-2.5 bg-[#181818] border border-[#262626] rounded-sm text-center">
                          <span className="text-[10px] text-[#737373] capitalize block">{key}</span>
                          <span className="text-white font-medium">{val}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {/* Description & Inspiration photo */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Détail du Projet & Demande Client
                </h4>
                <div className="p-4 bg-[#181818] border border-[#262626] rounded-sm text-xs text-[#D4D4D4] leading-relaxed">
                  {selectedDemand.description}
                </div>

                {selectedDemand.inspirationImages && selectedDemand.inspirationImages.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs text-[#737373]">Photo d’inspiration jointe par le client :</span>
                    <div className="relative w-36 h-48 rounded-sm overflow-hidden border border-[#C5A880]">
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
              <div className="space-y-2 pt-4 border-t border-[#1F1F1F]">
                <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Notes Internes de l’Atelier (Privé)
                </h4>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Notes de rendez-vous, métrage de tissu nécessaire, acompte reçu..."
                  className="w-full p-3 bg-[#181818] border border-[#262626] rounded-sm text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-white text-xs uppercase tracking-wider rounded-sm"
                >
                  {savingNotes ? 'Enregistrement...' : 'Enregistrer les notes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[#737373]">
              Sélectionnez une demande dans la liste de gauche pour l’examiner.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
