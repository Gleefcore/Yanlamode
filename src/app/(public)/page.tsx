'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Play, ChevronDown, Truck, Shield, Scissors, MessageCircle } from 'lucide-react';
import CreationCard from '@/components/public/CreationCard';
import { Creation, Collection } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

const FILTER_TABS = ['Toutes', 'Homme', 'Femme', 'Cérémonie', 'Mariage', 'Sur mesure'];

/* Stagger reveal animation hook */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-fadeInUp');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '', delay = '' }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-8 ${delay} ${className}`} style={{ transitionDuration: '800ms' }}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Toutes');
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    trackEvent('page_view', { path: '/' });
    setHeroLoaded(true);

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
    <div className="bg-[#FAF8F5]">

      {/* ═══════════════════════════════════════════════════════
          HERO — CINEMATIC FULL-BLEED IMMERSIVE
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background Image — Full-bleed cinematic */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/creations/smoking-noir-prestige.jpg"
            alt="YANLAMODE — Haute Couture d'Exception"
            fill
            priority
            className={`object-cover object-top transition-transform duration-[2000ms] ease-out ${heroLoaded ? 'scale-100' : 'scale-110'}`}
          />
          {/* Dramatic Cinematic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/40 to-transparent" />
        </div>

        {/* Hero Content — Bottom-aligned editorial */}
        <div className={`relative z-10 w-full px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20 lg:pb-24 pt-40 transition-all duration-[1200ms] ease-out ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="max-w-7xl mx-auto">

            {/* Top Accent Line */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#C5A880]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C5A880] font-medium">
                Atelier · Haute Couture · Depuis 11 Ans
              </span>
            </div>

            {/* Main Typography — Sculptural */}
            <h1 className="font-serif-luxe text-[clamp(3rem,8vw,8rem)] leading-[0.9] text-white font-normal tracking-[0.02em] mb-6">
              YANLA<span className="text-[#C5A880]">MODE</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/80 font-light max-w-lg leading-relaxed mb-10">
              Des créations uniques façonnées avec passion. L'élégance masculine et féminine sublimée par le savoir-faire d'exception.
            </p>

            {/* CTAs — Minimal Modern */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <Link
                href="/creations"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0A0A0A] hover:bg-[#C5A880] hover:text-white transition-all duration-500 text-xs uppercase tracking-[0.2em] font-semibold"
              >
                <span>Découvrir les créations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/commander"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white hover:border-[#C5A880] hover:text-[#C5A880] transition-all duration-500 text-xs uppercase tracking-[0.2em] font-semibold backdrop-blur-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander</span>
              </Link>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center gap-6 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/50">
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                Cameroun · Europe · Canada
              </span>
              <span className="hidden sm:inline-block w-px h-3 bg-white/20" />
              <span className="hidden sm:flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
                Expéditions Sécurisées
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-white/40" />
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          TRUST STRIP — Horizontal Luxury Pillars
      ═══════════════════════════════════════════════════════ */}
      <section className="relative -mt-1 z-20 bg-white border-y border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E8E2D9]">
            {[
              { icon: <Truck className="w-5 h-5" />, title: 'Livraison Nationale', desc: 'Partout au Cameroun' },
              { icon: <ArrowUpRight className="w-5 h-5" />, title: 'International', desc: 'Europe & Canada' },
              { icon: <Scissors className="w-5 h-5" />, title: '11 Ans d\'Excellence', desc: 'Maître Couturier' },
              { icon: <MessageCircle className="w-5 h-5" />, title: 'Commande Directe', desc: 'Via WhatsApp' },
            ].map((pillar, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-6 sm:py-8 group hover:bg-[#FAF8F5] transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FAF8F5] group-hover:bg-white border border-[#E8E2D9] flex items-center justify-center text-[#C5A880] transition-colors">
                  {pillar.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0E0E10] uppercase tracking-wide">{pillar.title}</p>
                  <p className="text-[11px] text-[#8C8377]">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          MAISON — Split Editorial Introduction
      ═══════════════════════════════════════════════════════ */}
      <RevealSection className="py-24 sm:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 items-stretch">
            {/* Left — Image */}
            <div className="relative aspect-[4/5] lg:aspect-auto overflow-hidden group">
              <Image
                src="/images/creations/robe-maxi-batik-bronze.jpg"
                alt="L'art de la haute couture YANLAMODE"
                fill
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-auto">
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/95 backdrop-blur-md shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880] flex items-center justify-center text-white text-[11px] font-bold">11</div>
                  <div>
                    <p className="text-[11px] font-bold text-[#0E0E10] uppercase tracking-wide">Années d'Excellence</p>
                    <p className="text-[10px] text-[#8C8377]">Atelier Haute Couture · Cameroun</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Editorial Copy */}
            <div className="bg-white lg:bg-white flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-20 border border-[#E8E2D9] lg:border-l-0">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C5A880]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">La Maison</span>
              </div>

              <h2 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#0E0E10] leading-[1.05] font-normal mb-6">
                L'art de créer{' '}
                <span className="italic text-[#8C6D42]">autrement.</span>
              </h2>

              <p className="text-sm text-[#47413A] leading-relaxed font-light mb-4">
                Depuis plus d'une décennie, YANLAMODE conjugue l'art du textile d'exception et la rigueur de la coupe masculine et féminine. Chaque vêtement est pensé comme une sculpture en mouvement.
              </p>

              <p className="text-sm text-[#696259] leading-relaxed font-light mb-8">
                Des smokings à col châle parfaitement cintrés aux robes de gala en batik architectural, nous concevons des pièces pérennes, destinées aux moments qui marquent une vie.
              </p>

              <div className="flex items-center gap-6">
                <Link
                  href="/la-maison"
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#0E0E10] font-semibold hover:text-[#C5A880] transition-colors"
                >
                  <span className="luxury-underline pb-0.5">Découvrir la Maison</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>


      {/* ═══════════════════════════════════════════════════════
          COLLECTIONS — Immersive Tall Cards
      ═══════════════════════════════════════════════════════ */}
      <RevealSection className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-[#C5A880]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">Collections</span>
              </div>
              <h2 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl text-[#0E0E10] font-normal">
                Nos Univers
              </h2>
            </div>
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#0E0E10] font-semibold hover:text-[#C5A880] transition-colors"
            >
              <span className="luxury-underline pb-0.5">Toutes les Collections</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Collection Grid — Tall immersive cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((col) => (
              <Link
                key={col.id}
                href="/collections"
                className="group relative h-[500px] sm:h-[560px] overflow-hidden flex flex-col justify-end"
              >
                <Image
                  src={col.coverImage}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="relative z-10 p-6 space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A880] font-medium">
                    {col.season || 'Collection Signature'}
                  </span>
                  <h3 className="font-serif-luxe text-xl sm:text-2xl text-white group-hover:text-[#C5A880] transition-colors font-medium">
                    {col.title}
                  </h3>
                  <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed font-light">
                    {col.description}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70 group-hover:text-[#C5A880] font-medium transition-colors">
                    <span>Explorer</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>


      {/* ═══════════════════════════════════════════════════════
          CRÉATIONS — Curated Gallery with Filter Tabs
      ═══════════════════════════════════════════════════════ */}
      <RevealSection className="py-24 sm:py-32 bg-white border-y border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-[#C5A880]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">Galerie</span>
              </div>
              <h2 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl text-[#0E0E10] font-normal">
                Créations Phares
              </h2>
            </div>

            {/* Filter Tabs — Sleek pill style */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-all whitespace-nowrap font-medium rounded-full ${
                    selectedFilter === tab
                      ? 'bg-[#0E0E10] text-white'
                      : 'text-[#6B645C] hover:text-[#0E0E10] hover:bg-[#F0EDE8]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of creations */}
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs uppercase tracking-widest text-[#8C8377]">Chargement</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCreations.slice(0, 8).map((creation) => (
                <CreationCard key={creation.id} creation={creation} />
              ))}
            </div>
          )}

          {/* View All */}
          <div className="text-center pt-12">
            <Link
              href="/creations"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#0E0E10] text-white hover:bg-[#C5A880] transition-all duration-500 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </RevealSection>


      {/* ═══════════════════════════════════════════════════════
          SUR MESURE — Full-width Dramatic CTA
      ═══════════════════════════════════════════════════════ */}
      <RevealSection className="py-0">
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src="/images/creations/costume-ceremonie-blanc-rouge.jpg"
              alt="Atelier Sur Mesure"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/70 to-[#0A0A0A]/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#C5A880]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
                  Atelier Privé
                </span>
              </div>

              <h2 className="font-serif-luxe text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.05] mb-6">
                Votre silhouette.{' '}
                <span className="italic text-[#C5A880]">Notre savoir-faire.</span>
              </h2>

              <p className="text-sm sm:text-base text-white/60 leading-relaxed font-light mb-10 max-w-md">
                Confiez-nous vos mensurations et vos inspirations. Nous concevons une pièce unique, façonnée exclusivement pour vous.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sur-mesure"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C5A880] text-[#0A0A0A] hover:bg-white transition-all duration-500 text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Concevoir ma tenue</span>
                </Link>

                <a
                  href={generateWhatsAppLink({ type: 'sur-mesure' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { path: '/sur-mesure' })}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white hover:border-[#C5A880] hover:text-[#C5A880] transition-all duration-500 text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>


      {/* ═══════════════════════════════════════════════════════
          SOCIAL PROOF — Minimal Stats Strip
      ═══════════════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-[#0E0E10] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
              {[
                { value: '11+', label: "Années d'Excellence" },
                { value: '500+', label: 'Créations Réalisées' },
                { value: '3', label: 'Continents Livrés' },
                { value: '100%', label: 'Sur Mesure' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="font-serif-luxe text-4xl sm:text-5xl text-[#C5A880] font-normal">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>


      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER / CONTACT — Clean Final CTA
      ═══════════════════════════════════════════════════════ */}
      <RevealSection className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#C5A880]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">Contact</span>
            <div className="w-8 h-px bg-[#C5A880]" />
          </div>

          <h2 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl text-[#0E0E10] font-normal mb-6 leading-tight">
            Prêt à commander{' '}
            <span className="italic text-[#8C6D42]">votre pièce d'exception ?</span>
          </h2>

          <p className="text-sm text-[#696259] leading-relaxed font-light mb-10 max-w-lg mx-auto">
            Échangez directement avec notre atelier. Nous vous accompagnons de la conception à la livraison, partout au Cameroun, en Europe et au Canada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={generateWhatsAppLink({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { path: '/', section: 'footer-cta' })}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#0E0E10] text-white hover:bg-[#C5A880] hover:text-[#0E0E10] transition-all duration-500 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Nous Contacter sur WhatsApp</span>
            </a>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#0E0E10] font-semibold hover:text-[#C5A880] transition-colors"
            >
              <span className="luxury-underline pb-0.5">Autres moyens de contact</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Delivery notice */}
          <div className="mt-10 pt-8 border-t border-[#E8E2D9]">
            <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.25em] text-[#8C8377]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                Livraison Cameroun
              </span>
              <span className="w-px h-3 bg-[#D8CEBE]" />
              <span className="flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
                Expédition Europe
              </span>
              <span className="w-px h-3 bg-[#D8CEBE]" />
              <span className="flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
                Expédition Canada
              </span>
            </div>
          </div>
        </div>
      </RevealSection>

    </div>
  );
}
