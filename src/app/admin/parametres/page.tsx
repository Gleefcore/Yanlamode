'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/types';
import { Save, CheckCircle2, MessageCircle, Phone, Mail, MapPin, Globe, Sparkles } from 'lucide-react';

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
      <div className="py-24 text-center text-xs text-gray-400 bg-white border border-gray-200/70 rounded-2xl">
        Chargement des paramètres...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Paramètres Généraux de la Maison
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configurez le numéro WhatsApp officiel (+237 6 97 25 14 25), les coordonnées et la signature de marque.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Paramètres enregistrés !</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Identité de marque */}
        <div className="p-6 bg-white border border-gray-200/70 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
              1. Identité de la Maison & Héritage
            </h3>
            <Sparkles className="w-4 h-4 text-[#B48C56]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Nom de la Marque</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Années de Savoir-Faire</label>
              <input
                type="number"
                value={settings.experienceYears}
                onChange={(e) => setSettings({ ...settings, experienceYears: parseInt(e.target.value) || 11 })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Devise / Signature Principale</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Slogan Secondaire (Manifeste)</label>
            <input
              type="text"
              value={settings.secondaryTagline}
              onChange={(e) => setSettings({ ...settings, secondaryTagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Coordonnées & WhatsApp */}
        <div className="p-6 bg-white border border-gray-200/70 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
              2. Canal WhatsApp & Coordonnées Atelier
            </h3>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">
                Numéro WhatsApp Officiel (format international, sans le +) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-300 rounded-xl text-emerald-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                placeholder="237697251425"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Tous les boutons « COMMANDER » du site redirigeront vers ce numéro.
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Téléphone de Contact Affiché</label>
              <input
                type="text"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Courriel de l'Atelier</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Horaires d'Ouverture</label>
              <input
                type="text"
                value={settings.hours}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Adresse Physique & Siège</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="p-6 bg-white border border-gray-200/70 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
              3. Liens des Réseaux Sociaux
            </h3>
            <Globe className="w-4 h-4 text-gray-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Instagram</label>
              <input
                type="text"
                value={settings.socials.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, instagram: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold">TikTok</label>
              <input
                type="text"
                value={settings.socials.tiktok}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, tiktok: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Facebook</label>
              <input
                type="text"
                value={settings.socials.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, facebook: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer les Paramètres'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
