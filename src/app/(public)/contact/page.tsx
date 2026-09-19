'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock, Send, CheckCircle2, Globe, Sparkles, ShieldCheck } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
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
          fullName: formData.name,
          phone: formData.phone,
          whatsapp: formData.phone,
          email: formData.email,
          description: formData.message,
        }),
      });
      trackEvent('demand_submit', { path: '/contact' });
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
          <span>Conciergerie Privée & Rendez-vous Atelier</span>
        </div>

        <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl text-[#0E0E10] tracking-tight">
          Entrer en Contact
        </h1>

        <p className="text-xs sm:text-sm text-[#666360] max-w-xl mx-auto font-light leading-relaxed">
          Notre atelier de haute couture vous accueille pour l’étude de vos projets de gala, cérémonies et garde-robes sur-mesure d’exception.
        </p>

        {/* Global Delivery Badge */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#9E7A45] font-medium">
          <Globe className="w-3.5 h-3.5" />
          <span>Expéditions sécurisées & Essayages à distance : Cameroun · Europe · Canada</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left column: Direct Contact & Atelier coordinates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Primary WhatsApp Action Card */}
          <div className="p-8 bg-white border border-[#E8E2D9] rounded-sm space-y-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C5A880]/15 to-transparent pointer-events-none" />

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold block">
                Canal d’Échange Privilégié
              </span>
              <h3 className="font-serif-luxe text-2xl sm:text-3xl text-[#0E0E10]">
                Conciergerie WhatsApp
              </h3>
            </div>

            <p className="text-xs text-[#666360] leading-relaxed font-light">
              Pour une prise en charge instantanée, l'envoi de vos inspirations visuelles, la transmission de vos mensurations ou l'étude de votre budget, contactez directement l'atelier.
            </p>

            <a
              href={generateWhatsAppLink({ type: 'contact' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { path: '/contact' })}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#0E0E10] text-[#FAF8F5] font-semibold text-xs uppercase tracking-[0.22em] rounded-sm hover:bg-[#C5A880] hover:text-[#0E0E10] transition-all shadow-md group"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366] group-hover:scale-125 transition-transform" />
              <span>COMMANDER VIA L'ATELIER</span>
            </a>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#73706B] border-t border-[#F0ECE1]">
              <span>Réponse garantie sous 2h</span>
              <span className="font-mono text-[#0E0E10]">+237 6 97 25 14 25</span>
            </div>
          </div>

          {/* Detailed Info Cards */}
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-4 p-4.5 bg-white border border-[#E8E2D9] rounded-sm shadow-sm">
              <Phone className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[#0E0E10] font-medium uppercase tracking-wider text-[11px]">Lignes Directes de l'Atelier</p>
                <p className="text-[#666360] font-mono text-xs">+237 6 97 25 14 25 (WhatsApp Principal)</p>
                <p className="text-[#666360] font-mono text-xs">+237 6 97 25 14 25 (Standard Téléphonique)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4.5 bg-white border border-[#E8E2D9] rounded-sm shadow-sm">
              <Mail className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[#0E0E10] font-medium uppercase tracking-wider text-[11px]">Courriel Institutionnel</p>
                <p className="text-[#666360] text-xs">contact@yanlamode.com · commandes@yanlamode.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4.5 bg-white border border-[#E8E2D9] rounded-sm shadow-sm">
              <Globe className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[#0E0E10] font-medium uppercase tracking-wider text-[11px]">Couverture Géographique & Livraisons</p>
                <p className="text-[#666360] text-xs font-light leading-relaxed">
                  🇨🇲 Partout au Cameroun (Douala, Yaoundé, Bafoussam...)<br />
                  🇪🇺 Europe (France, Belgique, Allemagne, Suisse...)<br />
                  🇨🇦 Canada (Montréal, Toronto, Québec...)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4.5 bg-white border border-[#E8E2D9] rounded-sm shadow-sm">
              <Clock className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[#0E0E10] font-medium uppercase tracking-wider text-[11px]">Horaires des Salons d'Essayage</p>
                <p className="text-[#666360] text-xs">Lundi — Samedi : 09h00 à 19h00 (Sur rendez-vous préalable)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Refined Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D9] p-8 sm:p-12 rounded-sm shadow-sm">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold block">
                  Formulaire Sécurisé
                </span>
                <h2 className="font-serif-luxe text-2xl sm:text-3xl text-[#0E0E10] mt-1">
                  Transmettre Votre Demande
                </h2>
                <p className="text-xs text-[#666360] mt-1 font-light leading-relaxed">
                  Partagez-nous la nature de votre événement ou le modèle souhaité. Notre directeur d’atelier vous contactera personnellement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#0E0E10] mb-1.5 font-medium">Nom & Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-sm text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="M. / Mme Nom et Prénom"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#0E0E10] mb-1.5 font-medium">Téléphone & WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-sm text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-[#C5A880] transition-colors font-mono"
                    placeholder="+237 6..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#0E0E10] mb-1.5 font-medium">Adresse Courriel</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-sm text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-[#C5A880] transition-colors"
                  placeholder="nom@exemple.com"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#0E0E10] mb-1.5 font-medium">Votre Projet Haute Couture *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-sm text-xs text-[#0E0E10] placeholder-[#9E9892] focus:outline-none focus:border-[#C5A880] transition-colors leading-relaxed"
                  placeholder="Décrivez votre tenue souhaitée, la date de votre cérémonie, vos exigences en matière d'étoffes..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#0E0E10] text-[#FAF8F5] border border-[#C5A880]/50 font-semibold text-xs uppercase tracking-[0.24em] rounded-sm hover:bg-[#C5A880] hover:text-[#0E0E10] transition-all flex items-center justify-center gap-2.5 shadow-lg group disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#C5A880] group-hover:text-[#0E0E10] transition-colors" />
                <span>{submitting ? 'Transmission en cours...' : 'Envoyer Votre Projet à l’Atelier'}</span>
              </button>
            </form>
          ) : (
            <div className="py-20 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="font-serif-luxe text-3xl text-[#0E0E10]">Demande Bien Transmise</h3>
              <p className="text-xs text-[#666360] max-w-sm mx-auto leading-relaxed">
                Votre projet a été transmis à l'atelier privé. Un couturier prendra contact avec vous sur WhatsApp ou par téléphone sous peu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
