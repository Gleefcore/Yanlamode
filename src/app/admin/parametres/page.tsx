'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/types';
import { Save, CheckCircle2, MessageCircle, Phone, Mail, MapPin, Globe, Instagram, Facebook, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminParametresPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="py-24 text-center text-xs text-zinc-500 bg-[#0E0E12] border border-white/[0.08] rounded-sm">
        Chargement des paramètres de la maison...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
              Configuration Centrale
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono text-zinc-400">
              Paramètres Système
            </span>
          </div>
          <h1 className="font-serif-luxe text-3xl sm:text-4xl text-white tracking-wide mt-1">
            Paramètres & Identité de l'Atelier
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
            Gérez le numéro officiel de commande WhatsApp (+237 6 91 87 00 00), les coordonnées de contact et la signature éditoriale.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded-sm shadow-md animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Modifications enregistrées !</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Identité de marque */}
        <div className="p-6 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold flex items-center gap-2">
              <span>01.</span>
              <span>Identité & Héritage de la Maison</span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Nom Officiel de la Marque</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Années d'Excellence & Savoir-Faire</label>
              <input
                type="number"
                value={settings.experienceYears}
                onChange={(e) => setSettings({ ...settings, experienceYears: parseInt(e.target.value) || 11 })}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Devise / Signature Principale</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Slogan Secondaire (Manifeste)</label>
            <input
              type="text"
              value={settings.secondaryTagline}
              onChange={(e) => setSettings({ ...settings, secondaryTagline: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>
        </div>

        {/* Canaux de contact & WhatsApp officiel */}
        <div className="p-6 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold flex items-center gap-2">
              <span>02.</span>
              <span>Canal WhatsApp & Coordonnées Atelier</span>
            </span>
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                Numéro WhatsApp Officiel (format international, sans signe +) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#25D366]/5 border border-[#25D366]/40 rounded-sm text-[#25D366] font-mono focus:outline-none focus:border-[#25D366] transition-colors"
                placeholder="237691870000"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Tous les boutons « COMMANDER » redirigent directement vers cette ligne.
              </p>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Téléphone Affiché en Vitrine</label>
              <input
                type="text"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Courriel de l'Atelier</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Horaires de Consultation Privée</label>
              <input
                type="text"
                value={settings.hours}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Adresse Physique & Siège</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="p-6 bg-[#0E0E12] border border-white/[0.08] rounded-sm space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold flex items-center gap-2">
              <span>03.</span>
              <span>Réseaux Sociaux & Présence Digitale</span>
            </span>
            <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Instagram Atelier</label>
              <input
                type="text"
                value={settings.socials.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">TikTok Runway</label>
              <input
                type="text"
                value={settings.socials.tiktok}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, tiktok: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Page Facebook</label>
              <input
                type="text"
                value={settings.socials.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, facebook: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2.5 px-8 py-3 bg-[#C5A880] text-black font-semibold uppercase tracking-[0.16em] rounded-sm hover:bg-[#D4AF37] transition-all shadow-xl shadow-[#C5A880]/15 disabled:opacity-50 hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement en cours...' : 'Enregistrer les Paramètres'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
