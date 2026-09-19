'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Creation } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import GalleryModal from '@/components/public/GalleryModal';
import { MessageCircle, Maximize2, ShieldCheck, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';

export default function CreationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [creation, setCreation] = useState<Creation | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // User interactive order options before WhatsApp dispatch
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Partout au Cameroun');
  const [clientBudget, setClientBudget] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/creations');
        const list: Creation[] = await res.json();
        const found = list.find((c) => c.slug === slug);
        if (found) {
          setCreation(found);
          trackEvent('creation_view', {
            creationId: found.id,
            creationTitle: found.title,
            path: `/creations/${slug}`,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-[#737373] tracking-widest uppercase">
        Chargement de la création...
      </div>
    );
  }

  if (!creation) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="font-serif-luxe text-3xl text-[#111111]">Création Introuvable</h1>
        <p className="text-xs text-[#737373]">Cette pièce n’existe pas ou a été déplacée.</p>
        <Link
          href="/creations"
          className="px-6 py-2.5 bg-[#C5A880] text-black text-xs uppercase tracking-wider rounded-sm font-semibold"
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const handleOrderClick = () => {
    trackEvent('whatsapp_click', {
      creationId: creation.id,
      creationTitle: creation.title,
      destination: deliveryLocation,
    });
  };

  const dynamicWhatsAppUrl = generateWhatsAppLink({
    type: 'creation',
    creationTitle: creation.title,
    creationRef: creation.ref,
    availability: creation.status,
    fabric: creation.fabric,
    deliveryLocation: deliveryLocation,
    budget: clientBudget.trim() || undefined,
  });

  const isAvailable = creation.status !== 'Indisponible';

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-[#777777] uppercase tracking-wider">
        <Link href="/" className="hover:text-[#111111] transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/creations" className="hover:text-[#111111] transition-colors">Créations</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#9E7A45] font-semibold truncate max-w-[200px] sm:max-w-none">{creation.title}</span>
      </nav>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left column: Photo Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#FFFFFF] border border-[#E5DFD7] shadow-lg group">
            <Image
              src={creation.images[selectedImageIndex] || '/images/creations/costume-croise-rose.jpg'}
              alt={creation.title}
              fill
              priority
              className="object-cover object-center"
            />
            {/* Fullscreen zoom trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-4 right-4 p-3 bg-black/60 hover:bg-black text-white rounded-full border border-white/20 transition-all shadow-md"
              title="Agrandir en plein écran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {creation.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {creation.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-sm overflow-hidden border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#C5A880] ring-2 ring-[#C5A880]/40'
                      : 'border-[#E5DFD7] opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Angle ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Creation details & Bespoke Order */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#FFFFFF] p-8 sm:p-10 border border-[#E5DFD7] rounded-sm shadow-sm">
          <div className="space-y-6">
            {/* Status & Reference Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                {creation.category} · {creation.gender}
              </span>
              <span className="text-xs font-mono text-[#666666] bg-[#FAF8F5] px-2.5 py-1 border border-[#E5DFD7] rounded-sm">
                RÉF : {creation.ref}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif-luxe text-3xl sm:text-4xl text-[#111111] leading-tight">
              {creation.title}
            </h1>

            {/* Availability Indicator (Direct & Visible) */}
            <div className="flex flex-wrap items-center gap-3">
              {creation.status === 'Disponible sur commande' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#A5D6A7] bg-[#E8F5E9] text-[#1B5E20] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                  <span>Disponible sur commande</span>
                </div>
              ) : creation.status === 'Création sur mesure' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#DFC5A2] bg-[#FAF3E8] text-[#8C6D42] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                  <span>Confection sur mesure d'exception</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#E0E0E0] bg-[#F5F5F5] text-[#616161] text-xs font-medium">
                  <span>Modèle actuellement indisponible</span>
                </div>
              )}
              <span className="text-[11px] text-[#777777]">Délais atelier : 5 à 10 jours ouvrés</span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#555555] leading-relaxed">
              {creation.description}
            </p>

            {/* Specifications Details */}
            <div className="space-y-2.5 pt-4 border-t border-[#E5DFD7] text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E5DFD7]/60">
                <span className="text-[#777777] uppercase tracking-wider">Matières & Tissus</span>
                <span className="text-[#111111] font-medium text-right max-w-[65%]">{creation.fabric}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5DFD7]/60">
                <span className="text-[#777777] uppercase tracking-wider">Nuances disponibles</span>
                <span className="text-[#111111] font-medium">{creation.colors.join(' · ')}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5DFD7]/60">
                <span className="text-[#777777] uppercase tracking-wider">Confection</span>
                <span className="text-[#9E7A45] font-semibold">Patronage artisanal & Essayages privés</span>
              </div>
            </div>

            {/* Highlighted Delivery Card: Cameroun, Europe, Canada */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#111111] font-semibold uppercase tracking-wider">
                <span className="text-[#C5A880]">✦</span>
                <span>Livraisons Sécurisées</span>
              </div>
              <p className="text-[#555555] leading-relaxed text-[11px]">
                Nous livrons <strong>partout au Cameroun</strong> (Douala, Yaoundé, Bafoussam, Garoua...) ainsi qu'à l'international en <strong>Europe</strong> et au <strong>Canada</strong>.
              </p>
            </div>

            {/* Interactive Order Preferences before dispatch to Yanlamode WhatsApp */}
            <div className="space-y-4 pt-4 border-t border-[#E5DFD7]">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-2">
                  1. Votre Lieu de Livraison
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Partout au Cameroun', 'Europe', 'Canada'].map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setDeliveryLocation(dest)}
                      className={`py-2 px-2 text-[11px] rounded-sm border transition-all text-center font-medium ${
                        deliveryLocation === dest
                          ? 'border-[#C5A880] bg-[#111111] text-[#FAF8F5] shadow-xs'
                          : 'border-[#E5DFD7] bg-[#FAF8F5] text-[#555555] hover:border-[#C5A880]'
                      }`}
                    >
                      {dest === 'Partout au Cameroun' ? '🇨🇲 Cameroun' : dest === 'Europe' ? '🇪🇺 Europe' : '🇨🇦 Canada'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1.5">
                  2. Votre Budget Indicatif <span className="text-[10px] text-[#777777] font-normal">(Optionnel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : 250 000 - 400 000 FCFA / 500 €"
                  value={clientBudget}
                  onChange={(e) => setClientBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5DFD7] rounded-sm text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Reassurance points */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-[#666666]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>11 ans de savoir-faire</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Ajustement anatomique parfait</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Commander */}
          <div className="space-y-3 pt-6 border-t border-[#E5DFD7]">
            <a
              href={dynamicWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOrderClick}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#111111] text-[#FAF8F5] border border-[#C5A880]/50 font-semibold text-xs uppercase tracking-[0.25em] rounded-sm hover:bg-[#C5A880] hover:text-[#111111] transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A880]" />
              <span>Commander</span>
            </a>

            <p className="text-[11px] text-[#777777] text-center leading-normal">
              En cliquant sur <strong>Commander</strong>, vous êtes dirigé vers l'atelier <strong>Yanlamode</strong> avec un message récapitulant cette création, votre destination ({deliveryLocation}) et votre budget.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Modal Fullscreen */}
      <GalleryModal
        isOpen={isModalOpen}
        images={creation.images}
        currentIndex={selectedImageIndex}
        onClose={() => setIsModalOpen(false)}
        onPrev={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : creation.images.length - 1))}
        onNext={() => setSelectedImageIndex((prev) => (prev < creation.images.length - 1 ? prev + 1 : 0))}
        title={creation.title}
      />
    </div>
  );
}
