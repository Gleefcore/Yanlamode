'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/types';
import { Save, CheckCircle2, MessageCircle, Phone, Mail, MapPin, Globe, Instagram, Facebook } from 'lucide-react';

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
    return <div className="py-20 text-center text-xs text-[#737373]">Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="font-serif-luxe text-3xl text-white">Paramètres Généraux du Site</h1>
          <p className="text-xs text-[#737373] mt-1">
            Modifiez le numéro WhatsApp, les coordonnées, les réseaux sociaux et les textes de présentation.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Paramètres mis à jour avec succès !</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* Identité de marque */}
        <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold border-b border-[#1F1F1F] pb-2">
            1. Identité de la Maison
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A3A3A3] mb-1">Nom de la Marque</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[#A3A3A3] mb-1">Années de Savoir-Faire / Expérience</label>
              <input
                type="number"
                value={settings.experienceYears}
                onChange={(e) => setSettings({ ...settings, experienceYears: parseInt(e.target.value) || 11 })}
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A3A3A3] mb-1">Signature / Slogan Principal</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-[#A3A3A3] mb-1">Slogan Secondaire</label>
            <input
              type="text"
              value={settings.secondaryTagline}
              onChange={(e) => setSettings({ ...settings, secondaryTagline: e.target.value })}
              className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Canaux de contact & WhatsApp officiel */}
        <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold border-b border-[#1F1F1F] pb-2">
            2. WhatsApp & Coordonnées de l'Atelier
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A3A3A3] mb-1">
                Numéro WhatsApp Officiel (format international sans le +) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-[#25D366]/40 rounded-sm text-[#25D366] font-mono focus:outline-none focus:border-[#25D366]"
                placeholder="237691870000"
              />
              <p className="text-[10px] text-[#737373] mt-1">
                Tous les boutons « Commander sur WhatsApp » du site redirigeront vers ce numéro.
              </p>
            </div>

            <div>
              <label className="block text-[#A3A3A3] mb-1">Téléphone de Contact Affiché</label>
              <input
                type="text"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A3A3A3] mb-1">Email Professionnel</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[#A3A3A3] mb-1">Horaires d'Ouverture & Réception</label>
              <input
                type="text"
                value={settings.hours}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A3A3A3] mb-1">Adresse de l'Atelier & Localisation</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold border-b border-[#1F1F1F] pb-2">
            3. Liens des Réseaux Sociaux
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#A3A3A3] mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.socials.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[#A3A3A3] mb-1">TikTok URL</label>
              <input
                type="text"
                value={settings.socials.tiktok}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, tiktok: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[#A3A3A3] mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.socials.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, facebook: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#181818] border border-[#262626] rounded-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#C5A880] text-black font-semibold uppercase tracking-wider rounded-sm hover:bg-[#d4af37] transition-all shadow-xl disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement en cours...' : 'Enregistrer les Paramètres'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
