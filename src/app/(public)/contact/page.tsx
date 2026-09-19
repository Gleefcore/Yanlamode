'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock, Instagram, Facebook, Send, CheckCircle2 } from 'lucide-react';
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
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
          Échange & Rendez-vous
        </span>
        <h1 className="font-serif-luxe text-4xl sm:text-6xl text-[#111111] uppercase">
          PARLONS DE VOTRE PROCHAINE CRÉATION.
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
          Notre atelier vous accueille pour une séance d'essayage privée et l'étude de votre projet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left column: Direct Contact Cards */}
        <div className="lg:col-span-5 space-y-8">
          {/* Primary WhatsApp Action Card */}
          <div className="p-8 bg-[#FFFFFF] border border-[#C5A880]/40 rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-[#25D366]">
              <MessageCircle className="w-6 h-6 fill-current" />
              <h3 className="font-serif-luxe text-2xl text-[#111111]">Canal Privilégié WhatsApp</h3>
            </div>
            <p className="text-xs text-[#666666] leading-relaxed">
              Pour une réactivité immédiate, des conseils directs ou envoyer des photos, contactez directement l'atelier sur WhatsApp.
            </p>
            <a
              href={generateWhatsAppLink({ type: 'contact' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { path: '/contact' })}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#111111] text-[#FAF8F5] border border-[#C5A880]/50 font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-[#C5A880] hover:text-[#111111] transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>COMMANDER VIA L'ATELIER</span>
            </a>
          </div>

          {/* Details list */}
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-4 p-4 bg-[#FFFFFF] border border-[#E5DFD7] rounded-sm shadow-sm">
              <Phone className="w-4 h-4 text-[#C5A880] mt-0.5" />
              <div>
                <p className="text-[#111111] font-medium">Téléphone & Atelier</p>
                <p className="text-[#666666] mt-0.5 font-mono">+237 6 91 87 00 00 / +237 6 97 25 14 25</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#FFFFFF] border border-[#E5DFD7] rounded-sm shadow-sm">
              <Mail className="w-4 h-4 text-[#C5A880] mt-0.5" />
              <div>
                <p className="text-[#111111] font-medium">Courriel Professionnel</p>
                <p className="text-[#666666] mt-0.5">contact@yanlamode.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#FFFFFF] border border-[#E5DFD7] rounded-sm shadow-sm">
              <MapPin className="w-4 h-4 text-[#C5A880] mt-0.5" />
              <div>
                <p className="text-[#111111] font-medium">Zones de Livraison & Expéditions</p>
                <p className="text-[#666666] mt-0.5">Partout au Cameroun (Douala, Yaoundé...), Europe &amp; Canada. Expéditions express sécurisées.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#FFFFFF] border border-[#E5DFD7] rounded-sm shadow-sm">
              <Clock className="w-4 h-4 text-[#C5A880] mt-0.5" />
              <div>
                <p className="text-[#111111] font-medium">Horaires de Réception</p>
                <p className="text-[#666666] mt-0.5">Lundi — Samedi : 09h00 à 19h00 (Sur rendez-vous)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Contact form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5DFD7] p-8 sm:p-10 rounded-sm shadow-md">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-serif-luxe text-2xl text-[#111111]">
                Transmettre un Message à l'Atelier
              </h2>
              <p className="text-xs text-[#666666]">
                Laissez-nous vos coordonnées et votre demande, nous vous recontacterons dans les plus brefs délais.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Nom & Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Téléphone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="+237 6..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#555555] mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                  placeholder="votre-email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs text-[#555555] mb-1.5 font-medium">Votre Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                  placeholder="Décrivez votre demande, question ou disponibilité..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#111111] text-[#FAF8F5] border border-[#C5A880]/50 font-semibold text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#C5A880] hover:text-[#111111] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4 text-[#C5A880]" />
                <span>Envoyer le Message</span>
              </button>
            </form>
          ) : (
            <div className="py-16 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif-luxe text-2xl text-[#111111]">Message bien reçu</h3>
              <p className="text-xs text-[#666666]">
                Merci pour votre intérêt. Nous vous répondrons très rapidement sur WhatsApp ou par téléphone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
