'use client';

import { useState } from 'react';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import { MessageCircle, Upload, CheckCircle2, Scissors, Sparkles, Send, ArrowRight } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Parlez-nous de votre projet',
    desc: 'Décrivez votre besoin, votre style et l’événement d’exception que vous préparez.',
  },
  {
    step: '02',
    title: 'Définissons votre création',
    desc: 'Choisissez vos tissus préférés, vos teintes et partagez vos inspirations visuelles.',
  },
  {
    step: '03',
    title: 'Créons votre pièce',
    desc: 'Le couturier trace le patron, coupe les matières et confectionne votre pièce à la main.',
  },
  {
    step: '04',
    title: 'Une création pensée pour vous',
    desc: 'Un tombé parfait, ajusté à votre corps pour une allure inoubliable.',
  },
];

export default function SurMesurePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    whatsapp: '',
    email: '',
    gender: 'Homme',
    outfitType: 'Smoking de Cérémonie',
    occasion: '',
    eventDate: '',
    desiredColor: '',
    budget: '',
    deliveryLocation: 'Partout au Cameroun',
    chest: '',
    waist: '',
    hips: '',
    shoulder: '',
    height: '',
    description: '',
  });

  const [inspirationPreview, setInspirationPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInspirationPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        type: 'sur-mesure',
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        email: formData.email,
        gender: formData.gender,
        outfitType: formData.outfitType,
        occasion: formData.occasion,
        eventDate: formData.eventDate,
        budget: formData.budget,
        deliveryLocation: formData.deliveryLocation,
        measurements: {
          chest: formData.chest,
          waist: formData.waist,
          hips: formData.hips,
          shoulder: formData.shoulder,
          height: formData.height,
        },
        description: `${formData.description} [Livraison souhaitée : ${formData.deliveryLocation}]`,
        inspirationImages: inspirationPreview ? [inspirationPreview] : [],
      };

      const res = await fetch('/api/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        trackEvent('demand_submit', { path: '/sur-mesure' });
        setWhatsappLink(data.whatsappLink);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur s'est produite lors de l'envoi de votre demande. Veuillez contacter la maison sur WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Introduction */}
      <section className="text-center space-y-4">
        <span className="text-[11px] uppercase tracking-[0.32em] text-[#C5A880] font-semibold">
          Service Haute Couture Personnalisé
        </span>
        <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl text-[#0E0E10] font-normal leading-[1.05]">
          Votre Idée. <br />
          <span className="italic text-[#8C6D42]">Notre Savoir-Faire.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#615B52] max-w-xl mx-auto font-light leading-relaxed">
          Donnez vie à une tenue entièrement façonnée pour vous par notre Maître Couturier cumulant 11 années d’expérience dans l’art du sur-mesure.
        </p>
      </section>

      {/* 4 Process Steps */}
      <section className="space-y-10">
        <div className="text-center space-y-1.5">
          <span className="text-[10.5px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">Le Parcours de Confection</span>
          <h2 className="font-serif-luxe text-2xl sm:text-4xl text-[#0E0E10] font-normal">Comment se déroule votre commande ?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-8 bg-[#FFFFFF] border border-[#E8E2D9] space-y-3 relative group hover:border-[#C5A880] shadow-sm transition-all duration-400"
            >
              <span className="font-mono text-xs text-[#C5A880] font-medium tracking-widest block">
                ÉTAPE {item.step}
              </span>
              <h3 className="font-serif-luxe text-xl text-[#0E0E10] font-medium">
                {item.title}
              </h3>
              <p className="text-xs text-[#6B645B] leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bespoke Interactive Form */}
      <section className="max-w-4xl mx-auto bg-[#FFFFFF] border border-[#E8E2D9] p-8 sm:p-12 lg:p-16 space-y-8 shadow-sm">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="border-b border-[#E8E2D9] pb-5">
              <h2 className="font-serif-luxe text-2xl sm:text-3xl text-[#0E0E10] font-normal">
                Formulaire de Commande Sur Mesure
              </h2>
              <p className="text-xs text-[#6B645B] mt-1.5 font-light">
                Remplissez les détails de votre tenue. La demande est transmise à l'atelier et synchronisée directement sur WhatsApp.
              </p>
            </div>

            {/* Coordonnées */}
            <div className="space-y-4">
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#8C6D42] font-semibold">
                1. Vos Coordonnées
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : Alexandre"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : Koffi"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : +237 6 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Numéro WhatsApp (si différent)</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : +237 6 XX XX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* Spécifications de la tenue */}
            <div className="space-y-4 pt-4 border-t border-[#E5DFD7]">
              <h3 className="text-xs uppercase tracking-widest text-[#9E7A45] font-semibold">
                2. Caractéristiques de la Tenue
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Genre</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] focus:outline-none focus:border-[#C5A880] transition-colors"
                  >
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Couple">Ensemble Assorti / Couple</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Type de Tenue</label>
                  <input
                    type="text"
                    value={formData.outfitType}
                    onChange={(e) => setFormData({ ...formData, outfitType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : Smoking 3 pièces, Robe longue, Agbada..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Événement & Date</label>
                  <input
                    type="text"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : Mariage le 15 Décembre"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Couleur souhaitée</label>
                  <input
                    type="text"
                    value={formData.desiredColor}
                    onChange={(e) => setFormData({ ...formData, desiredColor: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : Vert émeraude, Noir satin..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Budget indicatif</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                    placeholder="Ex : 350 000 - 500 000 FCFA / 600€"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#555555] mb-1.5 font-medium">Zone de Livraison</label>
                  <select
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] focus:outline-none focus:border-[#C5A880] transition-colors"
                  >
                    <option value="Partout au Cameroun">🇨🇲 Partout au Cameroun</option>
                    <option value="Europe">🇪🇺 Europe (France, Belgique, Suisse...)</option>
                    <option value="Canada">🇨🇦 Canada (Montréal, Québec, Toronto...)</option>
                    <option value="Autre destination">🌍 Autre destination internationale</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mensurations indicatives */}
            <div className="space-y-4 pt-4 border-t border-[#E5DFD7]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest text-[#9E7A45] font-semibold">
                  3. Mensurations (Facultatif ou approximatif)
                </h3>
                <span className="text-[10px] text-[#777777]">Un essayage physique ou vidéo confirmera les mesures</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] text-[#777777] mb-1 font-medium">Poitrine (cm)</label>
                  <input
                    type="text"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] focus:outline-none focus:border-[#C5A880]"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#777777] mb-1 font-medium">Taille (cm)</label>
                  <input
                    type="text"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] focus:outline-none focus:border-[#C5A880]"
                    placeholder="84"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#777777] mb-1 font-medium">Bassin / Hanches</label>
                  <input
                    type="text"
                    value={formData.hips}
                    onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] focus:outline-none focus:border-[#C5A880]"
                    placeholder="102"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#777777] mb-1 font-medium">Carrure épaules</label>
                  <input
                    type="text"
                    value={formData.shoulder}
                    onChange={(e) => setFormData({ ...formData, shoulder: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] focus:outline-none focus:border-[#C5A880]"
                    placeholder="47"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#777777] mb-1 font-medium">Stature (cm)</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] focus:outline-none focus:border-[#C5A880]"
                    placeholder="182"
                  />
                </div>
              </div>
            </div>

            {/* Description & Photo d'inspiration */}
            <div className="space-y-4 pt-4 border-t border-[#E5DFD7]">
              <h3 className="text-xs uppercase tracking-widest text-[#9E7A45] font-semibold">
                4. Description du Projet & Inspiration
              </h3>
              <div>
                <label className="block text-xs text-[#555555] mb-1.5 font-medium">Décrivez votre idée dans les détails *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                  placeholder="Précisez la coupe voulue, le style des revers, les broderies souhaitées, etc."
                />
              </div>

              {/* Upload inspiration photo */}
              <div>
                <label className="block text-xs text-[#555555] mb-2 font-medium">Photo(s) d’inspiration (croquis, tenue repérée...)</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#F5F1EA] border border-[#E5DFD7] hover:border-[#C5A880] text-xs text-[#111111] rounded-sm transition-all shadow-sm">
                    <Upload className="w-4 h-4 text-[#C5A880]" />
                    <span>Choisir une photo d'inspiration</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {inspirationPreview && (
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden border-2 border-[#C5A880] shadow-sm">
                      <Image src={inspirationPreview} alt="Aperçu inspiration" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-[#E5DFD7]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#0E0E10] hover:bg-[#C5A880] text-[#FFFFFF] hover:text-[#0E0E10] border border-[#0E0E10] hover:border-[#C5A880] transition-all duration-400 font-semibold text-xs uppercase tracking-[0.26em] shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Transmission à l'atelier en cours...</span>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] group-hover:bg-[#0E0E10]" />
                    <span>TRANSMETTRE MA COMMANDE SUR MESURE</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State */
          <div className="py-16 text-center space-y-6">
            <div className="w-16 h-16 bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#8C6D42] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif-luxe text-3xl sm:text-4xl text-[#0E0E10] font-normal">
                Votre commande a été transmise à l'atelier
              </h2>
              <p className="text-xs sm:text-sm text-[#666157] max-w-md mx-auto leading-relaxed font-light">
                Le Maître Couturier étudie vos spécifications. Cliquez sur le bouton ci-dessous pour finaliser l'échange sur WhatsApp.
              </p>
            </div>

            <div className="pt-4">
              <a
                href={whatsappLink || 'https://wa.me/237697251425'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-9 py-4 bg-[#0E0E10] text-[#FFFFFF] hover:bg-[#C5A880] hover:text-[#0E0E10] border border-[#0E0E10] hover:border-[#C5A880] font-semibold text-xs uppercase tracking-[0.26em] transition-all duration-400 shadow-md"
              >
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                <span>OUVRIR MON ÉCHANGE SUR WHATSAPP</span>
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
