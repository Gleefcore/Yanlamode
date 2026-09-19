'use client';

import { useState } from 'react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { BookOpen, GraduationCap, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function FormationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    trainingDuration: '',
    motivation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        type: 'formation',
        fullName: form.fullName,
        phone: form.phone,
        whatsapp: form.phone,
        trainingDuration: form.trainingDuration,
        motivation: form.motivation,
        description: `Demande de formation: ${form.trainingDuration}`,
      };

      await fetch('/api/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const waLink = generateWhatsAppLink({
        type: 'formation',
        customDetails: {
          Sujet: 'Inscription à la Formation',
          Nom: form.fullName,
          Téléphone: form.phone,
          Durée_souhaitée: form.trainingDuration,
          Motivation: form.motivation,
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
    <main className="pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Partie Gauche : Image et Texte */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
              Académie Yanlamode
            </span>
            <h1 className="font-serif-luxe text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Devenez un expert de la Haute Couture.
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
              Plongez dans l'univers de la mode et de la confection sur mesure. 
              Notre Maître Couturier vous ouvre les portes de son atelier pour vous transmettre ses 11 années de savoir-faire.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Pratique Intensive</h3>
                <p className="text-xs text-gray-500 mt-1">Apprenez le patronage, la coupe, et la finition directement dans un atelier en pleine production.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Formation Adaptée</h3>
                <p className="text-xs text-gray-500 mt-1">Choisissez la durée qui vous convient selon votre objectif : initiation, perfectionnement ou maîtrise.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Lieu de formation</h3>
                <p className="text-xs text-gray-500 mt-1">Les sessions se déroulent exclusivement dans notre boutique et atelier au Cameroun.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partie Droite : Formulaire */}
        <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative">
          <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-gray-900 text-white text-[10px] uppercase font-bold tracking-widest py-1.5 px-4 rounded-full shadow-lg">
            Places limitées
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Demande d'inscription</h2>
          <p className="text-sm text-gray-500 mb-8">Remplissez ce formulaire pour recevoir les modalités et le programme de la formation.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nom & Prénom *</label>
              <input 
                required
                value={form.fullName}
                onChange={e => setForm({...form, fullName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors text-sm"
                placeholder="Ex: Jean Dupont"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Téléphone (WhatsApp) *</label>
              <input 
                required
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors text-sm"
                placeholder="Ex: +237 6XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Temps de formation souhaité *</label>
              <select
                required
                value={form.trainingDuration}
                onChange={e => setForm({...form, trainingDuration: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors text-sm"
              >
                <option value="" disabled>Sélectionnez une durée...</option>
                <option value="1 mois (Initiation)">1 mois (Initiation)</option>
                <option value="3 mois (Perfectionnement)">3 mois (Perfectionnement)</option>
                <option value="6 mois (Maîtrise complète)">6 mois (Maîtrise complète)</option>
                <option value="Autre (à discuter)">Autre (à discuter)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Votre Motivation</label>
              <textarea 
                rows={3}
                required
                value={form.motivation}
                onChange={e => setForm({...form, motivation: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-colors text-sm"
                placeholder="Pourquoi souhaitez-vous vous former chez Yanlamode ?"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all disabled:opacity-70"
            >
              {submitting ? 'Envoi en cours...' : (
                <>
                  <span>Soumettre ma candidature</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
