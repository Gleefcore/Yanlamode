'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import CreationCard from '@/components/public/CreationCard';
import { Creation, Collection } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

const FILTER_TABS = ['Toutes', 'Homme', 'Femme', 'Cérémonie', 'Mariage', 'Sur mesure'];

export default function HomePage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Toutes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('page_view', { path: '/' });

    async function fetchData() {
      try {
        const [resCreations, resCollections] = await Promise.all([
          fetch('/api/creations'),
          fetch('/api/collections'),
        ]);
        const dataCreations = await resCreations.json();
        const dataCollections = await resCollections.json();
        setCreations(Array.isArray(dataCreations) ? dataCreations : []);
        setCollections(Array.isArray(dataCollections) ? dataCollections : []);
      } catch (e) {
        console.error('Failed to load home data', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCreations = creations.filter((creation) => {
    if (selectedFilter === 'Toutes') return true;
    if (selectedFilter === 'Homme') return creation.gender === 'Homme';
    if (selectedFilter === 'Femme') return creation.gender === 'Femme';
    if (selectedFilter === 'Cérémonie') return creation.category === 'Cérémonie' || creation.category === 'Costume & Smoking';
    if (selectedFilter === 'Mariage') return creation.category === 'Cérémonie' || creation.description.toLowerCase().includes('mariage');
    if (selectedFilter === 'Sur mesure') return creation.status === 'Création sur mesure';
    return true;
  });

  return (
    <div className="space-y-28 md:space-y-36 pb-28 bg-[#FAF8F5]">
      {/* ========================================================
          HERO PRINCIPAL — LUXE ÉDITORIAL & HAUTE COUTURE
      ======================================================== */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        {/* Background Visual with Masterpiece Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/creations/smoking-noir-prestige.jpg"
            alt="YANLAMODE Haute Couture Hero"
            fill
            priority
            className="object-cover object-center filter brightness-[0.92] contrast-[1.03]"
          />
          {/* Luminous Silk Ivory Gradient Veil (50% Canvas) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-[#FAF8F5]/65" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#FAF8F5]/40 to-[#FAF8F5]" />
        </div>

        {/* Hero Editorial Body */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Discreet Monogram & Experience Ribbon */}
          <div className="inline-flex items-center gap-3 px-5 py-2 border border-[#C5A880]/60 bg-[#FFFFFF]/90 backdrop-blur-md text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#8C6D42] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
            <span>Maison Fondée il y a 11 Ans · Atelier Cameroun</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          </div>

          {/* Majestic Sculptural Typography */}
          <div className="space-y-4">
            <h1 className="font-serif-luxe text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.06em] text-[#0E0E10] font-normal uppercase leading-[0.95]">
              YANLAMODE
              <span className="block font-serif text-3xl sm:text-5xl md:text-6xl text-[#C5A880] italic font-light tracking-[0.16em] mt-3">
                Haute Couture
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#3A352F] max-w-xl mx-auto font-medium tracking-[0.28em] uppercase pt-2">
              L’élégance façonnée sur mesure
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#635D55] max-w-lg mx-auto leading-relaxed font-light">
            Une signature d'exception au confluent de la haute couture contemporaine et des matières les plus nobles. Pièces d'apparat, smokings de gala et créations sur mesure.
          </p>

          {/* Minimalist Luxury CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/creations"
              className="w-full sm:w-auto px-9 py-4 bg-[#0E0E10] text-[#FFFFFF] hover:bg-[#C5A880] hover:text-[#0E0E10] transition-all duration-400 text-xs uppercase tracking-[0.26em] font-semibold border border-[#0E0E10] hover:border-[#C5A880] shadow-sm"
            >
              Explorer les créations
            </Link>

            <a
              href={generateWhatsAppLink({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { path: '/' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-[#FFFFFF] text-[#0E0E10] hover:bg-[#0E0E10] hover:text-[#FFFFFF] border border-[#C5A880] hover:border-[#0E0E10] transition-all duration-400 text-xs uppercase tracking-[0.26em] font-semibold shadow-sm group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] group-hover:bg-[#FFFFFF] transition-colors" />
              <span>COMMANDER</span>
            </a>
          </div>

          {/* Floating Luxury Delivery Micro-notice */}
          <div className="pt-6 text-[10px] tracking-[0.24em] uppercase text-[#8C8377]">
            Expéditions suivies et assurées : <span className="text-[#0E0E10] font-medium">Cameroun · Europe · Canada</span>
          </div>
        </div>

        {/* Discreet Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-60">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C8377]">Défiler</span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-[#C5A880] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ========================================================
          LES 4 PILIERS DE LA MAISON — DESIGN ARCHITECTURAL ÉPURÉ
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8E2D9] border border-[#E8E2D9] shadow-sm">
          <div className="bg-[#FFFFFF] p-8 space-y-2.5">
            <span className="font-mono text-[11px] text-[#C5A880] font-medium tracking-widest">01 / LIVRAISON NATIONALE</span>
            <h3 className="font-serif-luxe text-lg text-[#0E0E10] font-semibold">Partout au Cameroun</h3>
            <p className="text-xs text-[#6B645C] leading-relaxed">
              Expéditions sécurisées à Douala, Yaoundé, Bafoussam, Garoua et dans toutes les régions.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 space-y-2.5">
            <span className="font-mono text-[11px] text-[#C5A880] font-medium tracking-widest">02 / INTERNATIONAL</span>
            <h3 className="font-serif-luxe text-lg text-[#0E0E10] font-semibold">Europe &amp; Canada</h3>
            <p className="text-xs text-[#6B645C] leading-relaxed">
              Envois express suivis et soignés en France, Belgique, Suisse, Canada et reste du monde.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 space-y-2.5">
            <span className="font-mono text-[11px] text-[#C5A880] font-medium tracking-widest">03 / MAÎTRE COUTURIER</span>
            <h3 className="font-serif-luxe text-lg text-[#0E0E10] font-semibold">11 Ans d'Excellence</h3>
            <p className="text-xs text-[#6B645C] leading-relaxed">
              Patronage de haute précision, drap de laine italienne, dentelles suisses et finitions faites main.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 space-y-2.5">
            <span className="font-mono text-[11px] text-[#C5A880] font-medium tracking-widest">04 / CONCIERGERIE</span>
            <h3 className="font-serif-luxe text-lg text-[#0E0E10] font-semibold">Commande Privilégiée</h3>
            <p className="text-xs text-[#6B645C] leading-relaxed">
              Bouton « Commander » relié directement à l'atelier Yanlamode (+237 6 91 87 00 00).
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION INTRODUCTION ÉDITORIALE — L'ART DE CRÉER AUTREMENT
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-[#FFFFFF] p-8 sm:p-14 lg:p-20 border border-[#E8E2D9] shadow-sm">
          <div className="lg:col-span-5 relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB] border border-[#E8E2D9]/70">
            <Image
              src="/images/creations/robe-maxi-batik-bronze.jpg"
              alt="L'art de la haute couture YANLAMODE"
              fill
              className="object-cover object-center scale-102 hover:scale-106 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 p-4 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#C5A880]/60">
              <p className="font-serif-luxe text-base text-[#0E0E10] font-semibold">L'Atelier Haute Couture</p>
              <p className="text-[10px] text-[#8C6D42] tracking-widest uppercase mt-0.5 font-medium">
                Maître Couturier · 11 Années de Métier
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 lg:pl-4">
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#C5A880] font-semibold">
              Manifeste de la Maison
            </span>
            <h2 className="font-serif-luxe text-4xl sm:text-5xl lg:text-6xl text-[#0E0E10] leading-[1.05] font-normal">
              L’art de créer <br />
              <span className="italic text-[#8C6D42]">autrement.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#47413A] leading-relaxed font-light">
              Depuis plus d'une décennie, YANLAMODE conjugue l'art du textile d'exception et la rigueur de la coupe masculine et féminine. Chaque vêtement est pensé comme une sculpture en mouvement, révélant la noblesse de votre port et la force de votre personnalité.
            </p>
            <p className="text-xs sm:text-sm text-[#696259] leading-relaxed font-light">
              Des smokings à col châle parfaitement cintrés aux robes de gala en batik architectural, nous concevons des pièces pérennes, destinées aux moments qui marquent une vie.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <Link
                href="/la-maison"
                className="text-xs uppercase tracking-[0.24em] text-[#0E0E10] font-semibold luxury-underline pb-1"
              >
                Découvrir la Maison
              </Link>
              <Link
                href="/sur-mesure"
                className="text-xs uppercase tracking-[0.24em] text-[#C5A880] font-semibold luxury-underline pb-1"
              >
                Commander sur mesure
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION COLLECTIONS SIGNATURE
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#C5A880] font-semibold">
              Univers &amp; Lignes
            </span>
            <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#0E0E10] font-normal">
              Nos Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-xs uppercase tracking-[0.22em] text-[#0E0E10] hover:text-[#C5A880] transition-colors font-semibold luxury-underline"
          >
            Toutes les Collections →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href="/collections"
              className="group relative h-[440px] overflow-hidden border border-[#E8E2D9] hover:border-[#C5A880] transition-all duration-500 flex flex-col justify-end p-6 bg-[#0E0E10]"
            >
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover object-center group-hover:scale-106 transition-transform duration-700 filter brightness-[0.78] group-hover:brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/35 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[9.5px] uppercase tracking-[0.28em] text-[#C5A880] font-medium">
                  {col.season || 'Collection Signature'}
                </span>
                <h3 className="font-serif-luxe text-xl sm:text-2xl text-white group-hover:text-[#C5A880] transition-colors font-medium">
                  {col.title}
                </h3>
                <p className="text-[11px] text-[#C7C2BA] line-clamp-2 leading-relaxed font-light">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-[#FFFFFF] group-hover:text-[#C5A880] font-medium">
                  <span>Découvrir</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          SÉLECTION DES CRÉATIONS DU MOMENT
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E2D9] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#C5A880] font-semibold">
              Galerie Exclusive
            </span>
            <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#0E0E10] font-normal">
              Créations Phares
            </h2>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap font-medium ${
                  selectedFilter === tab
                    ? 'bg-[#0E0E10] text-white'
                    : 'bg-[#FFFFFF] text-[#6B645C] hover:text-[#0E0E10] border border-[#E8E2D9] hover:border-[#C5A880]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of creations */}
        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#736E67]">
            Présentation des modèles en cours...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreations.slice(0, 8).map((creation) => (
              <CreationCard key={creation.id} creation={creation} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center pt-8">
          <Link
            href="/creations"
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#FFFFFF] border border-[#0E0E10] text-[#0E0E10] hover:bg-[#0E0E10] hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.24em] font-semibold shadow-sm"
          >
            <span>Voir l'intégralité du catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          INVITATION ATELIER PRIVÉ — SUR-MESURE EXCLUSIF
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden border border-[#C5A880]/50 bg-[#0E0E10] text-[#F5F2EB] p-8 sm:p-14 lg:p-20 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-block text-[11px] uppercase tracking-[0.32em] text-[#C5A880] font-semibold">
              Atelier Privé &amp; Confection Sur Mesure
            </span>
            <h2 className="font-serif-luxe text-4xl sm:text-6xl text-white font-normal leading-[1.05]">
              Votre silhouette. <br />
              <span className="italic text-[#C5A880]">Notre savoir-faire d'exception.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB6AC] leading-relaxed font-light">
              Vous imaginez une pièce unique pour un mariage, un gala diplomatique ou une grande réception ? Transmettez vos mensurations ou échangez avec le créateur pour concevoir une création façonnée exclusivement pour vous.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/sur-mesure"
                className="px-8 py-4 bg-[#C5A880] text-[#0E0E10] hover:bg-[#FFFFFF] transition-all text-xs uppercase tracking-[0.24em] font-semibold text-center shadow-md"
              >
                Concevoir ma tenue sur mesure
              </Link>
              <a
                href={generateWhatsAppLink({ type: 'sur-mesure' })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { path: '/sur-mesure' })}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent border border-[#C5A880] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#0E0E10] transition-all text-xs uppercase tracking-[0.24em] font-semibold"
              >
                <span>Commander via l'Atelier</span>
              </a>
            </div>
          </div>

          {/* Subtle Background Texture Visual */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden lg:block pointer-events-none">
            <Image
              src="/images/creations/costume-ceremonie-blanc-rouge.jpg"
              alt="Atelier Privé"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E10] via-[#0E0E10]/80 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}
