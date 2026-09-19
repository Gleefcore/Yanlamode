'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Sparkles, Award, Scissors, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-24 md:space-y-36 pb-24 bg-[#FAF8F5]">
      {/* ========================================================
          HERO PRINCIPAL — LUXE & HAUTE COUTURE IMMERSIVE
      ======================================================== */}
      <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        {/* Background Image with Light Gold & Ivory Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/creations/smoking-noir-prestige.jpg"
            alt="YANLAMODE Haute Couture Hero"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-[0.88] contrast-105"
          />
          {/* Luminous Ivory & Gold Overlay (50% Canvas) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/75 to-[#FAF8F5]/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge 11 Ans (6% Or Doré) */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#C5A880] bg-[#FFFFFF]/90 backdrop-blur-md text-[#8C6D42] text-xs uppercase tracking-[0.25em] shadow-sm">
            <Award className="w-4 h-4 text-[#C5A880]" />
            <span className="font-semibold">11 Années de Savoir-Faire d'Exception</span>
          </div>

          {/* Title in Sculptural Haute Couture Black & Gold */}
          <div className="space-y-4">
            <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.08em] text-[#111111] font-medium uppercase leading-[1.05]">
              YANLAMODE <br />
              <span className="gold-gradient-text italic font-normal tracking-wider">Haute Couture</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#333333] max-w-2xl mx-auto font-medium tracking-[0.2em] uppercase">
              L’élégance façonnée sur mesure.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#66615B] max-w-xl mx-auto leading-relaxed">
            Maison de haute couture spécialisée dans la création de vêtements, tenues d'apparat et pièces sur mesure pour hommes et femmes d’exception.
          </p>

          {/* Buttons CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/creations"
              className="w-full sm:w-auto px-8 py-4 bg-[#111111] text-[#FFFFFF] font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#C5A880] hover:text-[#111111] transition-all duration-300 rounded-sm shadow-md border border-[#111111] hover:border-[#C5A880]"
            >
              Découvrir nos créations
            </Link>

            <a
              href={generateWhatsAppLink({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { path: '/' })}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#FFFFFF] text-[#111111] border border-[#C5A880] font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#C5A880] hover:text-white transition-all duration-300 rounded-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A880] fill-current" />
              <span>Commander</span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-70">
          <span className="text-[10px] uppercase tracking-widest text-[#7A7571]">Défiler</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#C5A880] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ========================================================
          LUXURY TRUST & EXPEDITIONS HIGHLIGHTS (PINTEREST / LOUNGE LIZARD INSPIRATION)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#FFFFFF] p-8 rounded-sm border border-[#E8E2D9] shadow-sm">
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#E8E2D9] pb-4 md:pb-0 md:pr-4">
            <span className="text-lg">🇨🇲</span>
            <h3 className="font-serif-luxe text-base text-[#111111] font-semibold">Partout au Cameroun</h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Expéditions sécurisées à Douala, Yaoundé, Bafoussam, Garoua et dans toutes les régions.
            </p>
          </div>

          <div className="space-y-2 border-b md:border-b-0 lg:border-r border-[#E8E2D9] pb-4 md:pb-0 md:pr-4">
            <span className="text-lg">🌍</span>
            <h3 className="font-serif-luxe text-base text-[#111111] font-semibold">Europe &amp; Canada</h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Livraisons internationales express suivies en France, Belgique, Suisse, Canada et reste du monde.
            </p>
          </div>

          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#E8E2D9] pb-4 md:pb-0 md:pr-4">
            <span className="text-lg">✂️</span>
            <h3 className="font-serif-luxe text-base text-[#111111] font-semibold">11 Ans de Savoir-Faire</h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Patronage de haute précision, matières nobles d'Italie et de Suisse, finitions artisanales.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-lg">💬</span>
            <h3 className="font-serif-luxe text-base text-[#111111] font-semibold">Commande Privilégiée</h3>
            <p className="text-xs text-[#66615B] leading-relaxed">
              Cliquez sur « Commander » pour échanger directement avec le créateur Yanlamode sur WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION INTRODUCTION — L'ART DE CRÉER AUTREMENT
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center bg-[#FFFFFF] p-8 sm:p-12 lg:p-16 rounded-sm border border-[#E8E2D9] shadow-sm">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-[#E8E2D9]">
            <Image
              src="/images/creations/robe-maxi-batik-bronze.jpg"
              alt="L'art de la haute couture YANLAMODE"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md border border-[#C5A880] rounded-sm">
              <p className="font-serif-luxe text-lg text-[#111111] font-semibold">Précision · Raffinement · Exclusivité</p>
              <p className="text-[11px] text-[#8C6D42] tracking-wider uppercase mt-0.5 font-medium">
                Atelier Haute Couture — Maître Couturier
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-bold">
              Notre Philosophie
            </span>
            <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111] leading-tight font-medium">
              L’art de créer autrement.
            </h2>
            <p className="text-sm text-[#4A4641] leading-relaxed">
              Depuis 11 années, YANLAMODE transforme les matières nobles, les silhouettes et les inspirations culturelles en créations pensées pour révéler la personnalité et la prestance de chaque client.
            </p>
            <p className="text-sm text-[#736E67] leading-relaxed">
              Chaque coupe est calculée au millimètre, chaque doublure en soie est assemblée à la main et chaque détail est pensé pour une allure inoubliable, qu'il s'agisse d'un smoking de gala ou d'une robe de cérémonie architecturale.
            </p>

            <div className="pt-4">
              <Link
                href="/la-maison"
                className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#111111] hover:text-[#C5A880] border-b-2 border-[#C5A880] pb-2 font-semibold transition-all"
              >
                <span>Découvrir la Maison</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION COLLECTIONS
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-bold">
            Univers & Lignes
          </span>
          <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111] font-medium">
            Nos Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#66615B] max-w-lg mx-auto">
            Explorez nos séries capsules, créations d'apparat et pièces maîtresses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href="/collections"
              className="group relative h-[430px] rounded-sm overflow-hidden border border-[#E8E2D9] hover:border-[#C5A880] transition-all duration-500 flex flex-col justify-end p-6 shadow-sm hover:shadow-xl bg-white"
            >
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.75] group-hover:brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#E5C89C] font-semibold">
                  {col.season || 'Collection'}
                </span>
                <h3 className="font-serif-luxe text-2xl text-white group-hover:text-[#E5C89C] transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-[#D4D4D4] line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-white group-hover:text-[#E5C89C] font-medium">
                  <span>Découvrir</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-[#C5A880]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION SÉLECTION DE CRÉATIONS + FILTRES
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E2D9] pb-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-bold">
              Galerie Exclusive
            </span>
            <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111] font-medium">
              Créations Phares
            </h2>
            <p className="text-xs text-[#66615B]">
              Sélectionnez une catégorie ou explorez nos modèles disponibles sur commande.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-all whitespace-nowrap font-medium ${
                  selectedFilter === tab
                    ? 'bg-[#111111] text-white border border-[#111111]'
                    : 'bg-[#FFFFFF] text-[#66615B] hover:text-[#111111] border border-[#E8E2D9] hover:border-[#C5A880]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of creations (Pure White Cards) */}
        {loading ? (
          <div className="py-20 text-center text-sm text-[#736E67]">
            Chargement des créations en cours...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreations.slice(0, 8).map((creation) => (
              <CreationCard key={creation.id} creation={creation} />
            ))}
          </div>
        )}

        {/* View all button */}
        <div className="text-center pt-6">
          <Link
            href="/creations"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#FFFFFF] border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.25em] font-semibold rounded-sm shadow-sm"
          >
            <span>Voir toutes les créations</span>
            <ArrowRight className="w-4 h-4 text-[#C5A880]" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          SECTION SUR MESURE — CALL TO ACTION MAJEUR
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden border border-[#C5A880] bg-[#FFFFFF] p-8 sm:p-12 lg:p-16 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#8C6D42] font-bold">
              Atelier Privé & Personnalisé
            </span>
            <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111] leading-tight font-medium">
              Votre Idée. <br />
              <span className="gold-gradient-text italic font-normal">Notre Savoir-Faire.</span>
            </h2>
            <p className="text-sm text-[#4A4641] leading-relaxed">
              Vous préparez un mariage, un gala ou une cérémonie de prestige ? Décrivez votre vision, joignez vos photos d'inspiration et laissez notre créateur donner vie à votre silhouette sur mesure.
            </p>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="flex items-center gap-2.5 text-xs text-[#111111] font-medium">
                <Scissors className="w-4 h-4 text-[#C5A880]" />
                <span>Patronage sur mesure exclusif</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#111111] font-medium">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span>Tissus et broderies nobles d'art</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/sur-mesure"
                className="px-8 py-4 bg-[#111111] text-white font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#C5A880] hover:text-black transition-all rounded-sm text-center shadow-md"
              >
                Concevoir ma tenue sur mesure
              </Link>
              <a
                href={generateWhatsAppLink({ type: 'sur-mesure' })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { path: '/sur-mesure' })}
                className="flex items-center justify-center gap-2.5 px-6 py-4 bg-[#FFFFFF] border border-[#C5A880] text-[#111111] hover:bg-[#FAF6F0] transition-all rounded-sm text-xs uppercase tracking-[0.2em] font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A880] fill-current" />
                <span>Commander sur mesure</span>
              </a>
            </div>
          </div>

          {/* Decorative background visual */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 hidden lg:block pointer-events-none">
            <Image
              src="/images/creations/costume-ceremonie-blanc-rouge.jpg"
              alt="Sur mesure"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}
