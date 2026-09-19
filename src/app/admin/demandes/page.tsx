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
        setDemands(demands.map((d) => (d.id === updated.id ? updated : d)));
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
        setDemands(demands.map((d) => (d.id === updated.id ? updated : d)));
        alert('Notes internes de l’atelier enregistrées.');
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Suivi des Demandes & Commandes Salon Privé
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gérez le pipeline de vos clients, échangez en 1 clic sur WhatsApp et notez les retouches d'atelier.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl font-semibold">
            {demands.length} dossier(s) au total
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('Tous')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
              filterStatus === 'Tous'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tous ({demands.length})
          </button>
          {STATUS_LIST.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {st} ({demands.filter((d) => d.status === st).length})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher client, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-900"
          />
        </div>
      </div>

      {/* Main CRM split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Demand list */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="py-16 text-center text-xs text-gray-400 bg-white border border-gray-200/70 rounded-2xl">
              Chargement des dossiers clients...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400 bg-white border border-gray-200/70 rounded-2xl">
              Aucune demande dans ce filtre.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedDemand?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectDemand(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2.5 ${
                    isSelected
                      ? 'bg-white border-gray-900 shadow-md ring-1 ring-gray-900'
                      : 'bg-white border-gray-200/70 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-xs">{item.fullName}</span>
                      {item.status === 'Nouveau' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8C6D42] font-semibold text-[11px] truncate max-w-[200px]">
                      {item.outfitType || item.creationTitle || 'Projet Sur-Mesure'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.status === 'Nouveau'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : item.status === 'Confirmé'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-1 font-light">
                    {item.description}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Demand Inspector Panel */}
        <div className="lg:col-span-7 bg-white border border-gray-200/70 rounded-2xl p-6 sm:p-8 space-y-7 shadow-sm">
          {selectedDemand ? (
            <div className="space-y-7">
              {/* Header with WhatsApp Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#8C6D42] tracking-wider">
                      Dossier #{selectedDemand.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {selectedDemand.type === 'sur-mesure' ? 'Sur-Mesure' : 'Commande Vitrine'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {selectedDemand.fullName}
                  </h2>
                </div>

                {/* Direct WhatsApp Call to Action */}
                <a
                  href={`https://wa.me/${selectedDemand.whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}?text=${encodeURIComponent(
                    `Bonjour ${selectedDemand.fullName}, c'est l'atelier YANLAMODE Haute Couture. Je vous contacte concernant votre projet : ${selectedDemand.outfitType || selectedDemand.creationTitle || 'votre commande'}. Nos artisans sont à votre disposition.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-black font-semibold text-xs rounded-xl transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Échanger sur WhatsApp</span>
                </a>
              </div>

              {/* Status Pipeline Buttons */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                  Changer le statut du projet :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STATUS_LIST.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2.5 py-2 text-[10px] font-semibold rounded-xl border transition-all text-center ${
                        selectedDemand.status === st
                          ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200/80">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-semibold block mb-0.5">Téléphone & WhatsApp</span>
                  <a href={`tel:${selectedDemand.phone}`} className="text-gray-900 font-mono font-bold hover:text-[#8C6D42]">
                    {selectedDemand.phone}
                  </a>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-semibold block mb-0.5">Email</span>
                  <span className="text-gray-800 font-medium">{selectedDemand.email || 'Non renseigné'}</span>
                </div>

                {selectedDemand.type === 'formation' ? (
                  <>
                    <div className="col-span-1 sm:col-span-2">
                      <span className="text-gray-400 text-[10px] uppercase font-semibold block mb-0.5">Durée de formation souhaitée</span>
                      <span className="text-[#8C6D42] font-bold">{selectedDemand.trainingDuration || 'Non précisé'}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <span className="text-gray-400 text-[10px] uppercase font-semibold block mb-0.5">Motivation</span>
                      <span className="text-gray-800 font-medium">{selectedDemand.motivation || 'Non précisé'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-semibold block mb-0.5">Événement & Date</span>
                      <span className="text-gray-800 font-medium">{selectedDemand.occasion || 'Non précisé'}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-semibold block mb-0.5">Lieu de Livraison</span>
                      <span className="text-gray-800 font-bold">{selectedDemand.deliveryLocation || 'À définir'}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-semibold block mb-0.5">Budget Estimé</span>
                      <span className="text-[#8C6D42] font-bold">{selectedDemand.budget || 'À définir'}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Mensurations Details */}
              {selectedDemand.measurements && Object.values(selectedDemand.measurements).some(Boolean) && (
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-[#8C6D42] tracking-wider">
                    Mensurations de l'Atelier
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {Object.entries(selectedDemand.measurements).map(([key, val]) =>
                      val ? (
                        <div key={key} className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl text-center">
                          <span className="text-[10px] uppercase text-gray-400 font-medium capitalize block mb-0.5">{key}</span>
                          <span className="text-gray-900 font-bold font-mono">{val} cm</span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Description & Inspiration photo */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-[#8C6D42] tracking-wider">
                  Cahier des Charges du Client
                </h4>
                <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-xl text-xs text-gray-700 leading-relaxed">
                  {selectedDemand.description}
                </div>

                {selectedDemand.inspirationImages && selectedDemand.inspirationImages.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs text-gray-500 font-medium">Photo d’inspiration transmise :</span>
                    <div className="relative w-36 h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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

              {/* Internal Notes */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-[10px] uppercase font-bold text-[#8C6D42] tracking-wider">
                  Carnet Confidentiel de l'Atelier (Privé)
                </h4>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Notes d'essayage, métrage de tissu réservé, acomptes..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-900"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  {savingNotes ? 'Enregistrement...' : 'Enregistrer les notes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-gray-400">
              Sélectionnez une demande dans la liste de gauche pour afficher le dossier client complet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
