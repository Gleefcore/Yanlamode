'use client';

import { useState } from 'react';
import { Phone, MapPin, Clock, Send, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    deliveryLocation: '',
    budget: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          fullName: formData.fullName,
          phone: formData.phone,
          whatsapp: formData.phone,
          deliveryLocation: formData.deliveryLocation,
          budget: formData.budget,
          description: formData.description,
        }),
      });
      trackEvent('demand_submit', { path: '/contact' });
      
      const waLink = generateWhatsAppLink({
        type: 'creation',
        creationTitle: 'Commande / Projet Personnalisé',
        deliveryLocation: formData.deliveryLocation,
        budget: formData.budget,
        customDetails: {
          Nom: formData.fullName,
          Téléphone: formData.phone,
          Besoins: formData.description,
        }
      });
      
      window.location.href = waLink;
      setSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Introduction */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-medium">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>Atelier Yanlamode</span>
        </div>

        <h1 className="font-serif-luxe text-4xl sm:text-5xl text-[#0E0E10] tracking-tight font-bold">
          Commander & Échanger
        </h1>

        <p className="text-xs sm:text-sm text-[#666360] max-w-xl mx-auto font-light leading-relaxed">
          Décrivez votre projet. Notre maître couturier vous contactera personnellement pour finaliser votre commande.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left column: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-4 p-5 bg-white border border-[#E8E2D9] rounded-xl shadow-sm">
              <Phone className="w-5 h-5 text-[#C5A880] mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[#0E0E10] font-bold uppercase tracking-wider text-[11px]">Ligne Directe de l'Atelier</p>
                <p className="text-[#666360] font-mono text-sm">+237 6 97 25 14 25</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-[#E8E2D9] rounded-xl shadow-sm">
              <Globe className="w-5 h-5 text-[#C5A880] mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[#0E0E10] font-bold uppercase tracking-wider text-[11px]">Couverture Géographique & Livraisons</p>
                <p className="text-[#666360] text-xs font-light leading-relaxed">
                  🇨🇲 Partout au Cameroun (Douala, Yaoundé, Bafoussam...)<br />
                  🇪🇺 Europe (France, Belgique, Allemagne, Suisse...)<br />
                  🇨🇦 Canada (Montréal, Toronto, Québec...)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-[#E8E2D9] rounded-xl shadow-sm">
              <Clock className="w-5 h-5 text-[#C5A880] mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[#0E0E10] font-bold uppercase tracking-wider text-[11px]">Horaires des Salons d'Essayage</p>
                <p className="text-[#666360] text-xs">Lundi — Samedi : 09h00 à 19h00 (Sur rendez-vous préalable)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: The Unified Order Form */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D9] p-8 sm:p-12 rounded-2xl shadow-sm">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="font-serif-luxe text-2xl sm:text-3xl font-bold text-[#0E0E10] mb-2">
                  Détaillez votre demande
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nom & Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-gray-900 transition-colors"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Numéro WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-gray-900 transition-colors font-mono"
                    placeholder="+237 6..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lieu de livraison souhaité *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs focus:bg-white focus:border-gray-900 transition-colors"
                    placeholder="Ville ou Pays (Ex: Douala, Paris)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Budget approximatif (Optionnel)</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="Ex: 50 000 FCFA"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Votre Projet / Vos Besoins *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-gray-900 transition-colors leading-relaxed"
                  placeholder="Que souhaitez-vous commander ? Une tenue sur mesure, une robe de mariée, un costume..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gray-900 text-white font-bold text-xs uppercase tracking-[0.24em] rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2.5 shadow-lg disabled:opacity-50"
              >
                <span>{submitting ? 'Transmission en cours...' : 'Envoyer ma commande'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="py-20 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="font-serif-luxe text-3xl text-[#0E0E10] font-bold">Demande Transmise</h3>
              <p className="text-xs text-[#666360] max-w-sm mx-auto leading-relaxed">
                Redirection vers WhatsApp en cours...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
