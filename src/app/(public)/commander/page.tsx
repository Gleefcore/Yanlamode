'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Creation } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { ArrowLeft, Send, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function CommanderForm() {
  const searchParams = useSearchParams();
  const creationId = searchParams.get('creationId');
  const router = useRouter();

  const [creation, setCreation] = useState<Creation | null>(null);
  const [loading, setLoading] = useState(!!creationId);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    deliveryLocation: '',
    budget: '',
    description: '',
  });

  useEffect(() => {
    if (creationId) {
      fetch('/api/creations')
        .then(res => res.json())
        .then(data => {
          const found = data.find((c: Creation) => c.id === creationId);
          if (found) setCreation(found);
        })
        .finally(() => setLoading(false));
    }
  }, [creationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        type: 'creation',
        fullName: form.fullName,
        phone: form.phone,
        whatsapp: form.phone,
        creationId: creation?.id,
        creationTitle: creation?.title,
        deliveryLocation: form.deliveryLocation,
        budget: form.budget,
        description: form.description,
      };

      await fetch('/api/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Redirect to WhatsApp
      const waLink = generateWhatsAppLink({
        type: 'creation',
        creationTitle: creation?.title || 'Commande Générale',
        deliveryLocation: form.deliveryLocation,
        customDetails: {
          Nom: form.fullName,
          Téléphone: form.phone,
          Budget: form.budget,
          Besoins: form.description,
        }
      });
      
      window.location.href = waLink;
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif-luxe text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Finaliser votre commande</h1>
        <p className="text-gray-600 text-sm">Veuillez détailler vos besoins pour que notre atelier puisse préparer votre création sur mesure ou votre livraison.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Chargement du modèle...</div>
      ) : creation ? (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 flex gap-4 items-center shadow-sm">
          <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0">
            <Image src={creation.images[0] || '/images/placeholder.jpg'} alt={creation.title} fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{creation.title}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{creation.description}</p>
            <p className="text-[10px] font-bold mt-2 text-[#8C6D42]">{creation.category}</p>
          </div>
        </div>
      ) : creationId ? (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl">Modèle introuvable.</div>
      ) : null}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200/60 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nom & Prénom *</label>
            <input 
              required
              value={form.fullName}
              onChange={e => setForm({...form, fullName: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors"
              placeholder="Ex: Jean Dupont"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Numéro de Téléphone *</label>
            <input 
              required
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors"
              placeholder="Ex: +237 6XX XX XX XX"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lieu de livraison souhaité *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              required
              value={form.deliveryLocation}
              onChange={e => setForm({...form, deliveryLocation: e.target.value})}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors"
              placeholder="Ville, Quartier ou Pays (Ex: Douala, Bonapriso ou France, Paris)"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5 ml-1">Nous expédions partout au Cameroun, en Europe et au Canada.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Détails de votre besoin / Mensurations</label>
          <textarea 
            rows={4}
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors"
            placeholder="Avez-vous des exigences particulières sur la taille, le tissu ou la coupe ?"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Budget approximatif (Optionnel)</label>
          <input 
            value={form.budget}
            onChange={e => setForm({...form, budget: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors"
            placeholder="Ex: 50 000 FCFA"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all disabled:opacity-70"
        >
          {submitting ? 'Envoi en cours...' : (
            <>
              <span>Envoyer ma commande</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function CommanderPage() {
  return (
    <main className="pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/creations" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>
      </div>
      <Suspense fallback={<div className="text-center py-20">Chargement...</div>}>
        <CommanderForm />
      </Suspense>
    </main>
  );
}
