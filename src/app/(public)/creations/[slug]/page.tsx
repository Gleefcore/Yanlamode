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
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#FFFFFF] p-8 sm:p-12 border border-[#E8E2D9] shadow-sm">
          <div className="space-y-6">
            {/* Status & Reference Header */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold">
                {creation.category} · {creation.gender}
              </span>
              <span className="text-[11px] font-mono text-[#736E67] bg-[#FAF8F5] px-3 py-1 border border-[#E8E2D9]">
                RÉF : {creation.ref}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl text-[#0E0E10] leading-tight font-normal">
              {creation.title}
            </h1>

            {/* Availability Indicator */}
            <div className="flex flex-wrap items-center gap-3">
              {creation.status === 'Disponible sur commande' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#A5D6A7] bg-[#E8F5E9] text-[#1B5E20] text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                  <span>Disponible sur commande</span>
                </div>
              ) : creation.status === 'Création sur mesure' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#DFC5A2] bg-[#FAF3E8] text-[#8C6D42] text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>Confection sur mesure d'exception</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#E0E0E0] bg-[#F5F5F5] text-[#616161] text-[11px] font-medium">
                  <span>Modèle actuellement indisponible</span>
                </div>
              )}
              <span className="text-[10.5px] text-[#7A746B] tracking-wider uppercase">Délai atelier : 5 à 10 jours</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#504A42] leading-relaxed font-light">
              {creation.description}
            </p>

            {/* Specifications Details */}
            <div className="space-y-2.5 pt-4 border-t border-[#E8E2D9] text-xs">
              <div className="flex justify-between py-2 border-b border-[#F2ECE4]">
                <span className="text-[#8C8377] uppercase tracking-[0.16em] text-[10.5px]">Matière noble</span>
                <span className="text-[#0E0E10] font-medium text-right max-w-[65%]">{creation.fabric}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2ECE4]">
                <span className="text-[#8C8377] uppercase tracking-[0.16em] text-[10.5px]">Palette de teintes</span>
                <span className="text-[#0E0E10] font-medium">{creation.colors.join(' · ')}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2ECE4]">
                <span className="text-[#8C8377] uppercase tracking-[0.16em] text-[10.5px]">Confection</span>
                <span className="text-[#8C6D42] font-semibold">Patronage Haute Précision</span>
              </div>
            </div>

            {/* Highlighted Delivery Card */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#0E0E10] font-semibold uppercase tracking-[0.2em] text-[10.5px]">
                <span className="text-[#C5A880]">✦</span>
                <span>Expéditions Sécurisées</span>
              </div>
              <p className="text-[#666157] leading-relaxed text-[11px] font-light">
                Livraisons directes <strong>partout au Cameroun</strong> (Douala, Yaoundé...), en <strong>Europe</strong> et au <strong>Canada</strong>.
              </p>
            </div>

            {/* Interactive Order Preferences */}
            <div className="space-y-4 pt-4 border-t border-[#E8E2D9]">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#0E0E10] font-semibold mb-2">
                  1. Zone de Livraison Souhaitée
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Partout au Cameroun', 'Europe', 'Canada'].map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setDeliveryLocation(dest)}
                      className={`py-2 px-2 text-[11px] border transition-all text-center font-medium ${
                        deliveryLocation === dest
                          ? 'border-[#0E0E10] bg-[#0E0E10] text-[#FFFFFF] shadow-xs'
                          : 'border-[#E8E2D9] bg-[#FAF8F5] text-[#555047] hover:border-[#C5A880]'
                      }`}
                    >
                      {dest === 'Partout au Cameroun' ? '🇨🇲 Cameroun' : dest === 'Europe' ? '🇪🇺 Europe' : '🇨🇦 Canada'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#0E0E10] font-semibold mb-1.5">
                  2. Votre Budget Indicatif <span className="text-[10px] text-[#8C8377] font-normal">(Optionnel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : 250 000 - 450 000 FCFA / 600 €"
                  value={clientBudget}
                  onChange={(e) => setClientBudget(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#0E0E10] placeholder-[#888888] focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Primary Action Button: Commander */}
          <div className="space-y-3 pt-6 border-t border-[#E8E2D9]">
            <a
              href={dynamicWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOrderClick}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#0E0E10] text-[#FFFFFF] hover:bg-[#C5A880] hover:text-[#0E0E10] transition-all duration-400 font-semibold text-xs uppercase tracking-[0.26em] shadow-md border border-[#0E0E10] hover:border-[#C5A880]"
            >
              <span className="w-2 h-2 rounded-full bg-[#C5A880] group-hover:bg-[#0E0E10]" />
              <span>COMMANDER CE MODÈLE</span>
            </a>

            <p className="text-[10.5px] text-[#7A746B] text-center leading-relaxed font-light">
              Mise en relation directe avec le créateur <strong>Yanlamode</strong> (+237 6 91 87 00 00) avec votre modèle, destination ({deliveryLocation}) et budget.
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
