'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Scissors, Sparkles, CheckCircle2, MessageCircle, Ruler, Layers, Eye, HeartHandshake, Globe, Compass, ShieldCheck } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

const STEPS = [
  {
    num: '01',
    title: 'Consultation & Esquisse',
    desc: 'Entretien privé autour de votre morphologie, de la solennité de l’événement et de votre posture pour esquisser les lignes directrices.',
    icon: Eye,
  },
  {
    num: '02',
    title: 'Sélection des Tissus d’Exception',
    desc: 'Laines superfines italiennes 150s, soies pures, velours de coton lourd, dentelles suisses et batiks artisanaux teints à la main.',
    icon: Layers,
  },
  {
    num: '03',
    title: 'Patronage & Découpe d’Atelier',
    desc: 'Tracé architectural millimétré à la craie et découpe manuelle des pièces pour assurer une chute noble et fluide.',
    icon: Scissors,
  },
  {
    num: '04',
    title: 'Entoilage & Montage Artisanal',
    desc: 'Assemblage traditionnel à plastron flottant conférant au veston sa tenue majestueuse et sa souplesse incomparable.',
    icon: Ruler,
  },
  {
    num: '05',
    title: 'Ajustement & Essayage Privé',
    desc: 'Séances de retouches méticuleuses au millimètre près en salon d’essayage pour sculpter l’allure sans contraindre le confort.',
    icon: Sparkles,
  },
  {
    num: '06',
    title: 'Finitions de Haute Joaillerie Textile',
    desc: 'Boutonnières milanaises cousues au fil de soie, surpiqûres à la main, boutons ciselés et doublures soyeuses personnalisées.',
    icon: CheckCircle2,
  },
  {
    num: '07',
    title: 'Livraison & Présentation de Gala',
    desc: 'Conditionnement sous housse de voyage haute couture rigide et expédition sécurisée au Cameroun, en Europe ou au Canada.',
    icon: HeartHandshake,
  },
];

const VALUES = [
  { title: 'Excellence', desc: 'Une exigence absolue sur chaque couture intérieure, invisible aux yeux mais garante d’une tenue intemporelle.' },
  { title: 'Harmonie', desc: 'Le dialogue harmonieux entre la rigueur du tailoring occidental et la flamboyance maîtrisée des textiles nobles africains.' },
  { title: 'Précision', desc: 'Un patronage géométrique taillé pour épouser chaque courbe avec aisance et sublimer la stature.' },
  { title: 'Sur-Mesure Pur', desc: 'Chaque pièce est une œuvre unique portant la signature exclusive de la personne qui l’incarne.' },
  { title: 'Distinction', desc: 'Une élégance discrète mais magnétique qui traverse les décennies sans jamais subir les modes éphémères.' },
];

export default function LaMaisonPage() {
  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero La Maison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-medium">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>Atelier de Haute Confection & Savoir-Faire</span>
        </div>

        <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl text-[#0E0E10] tracking-tight">
          La Maison YANLAMODE
        </h1>

        <p className="text-xs sm:text-base text-[#666360] max-w-2xl mx-auto font-light leading-relaxed">
          11 années d'artisanat d'art consacrées à la maîtrise du tailleur d'apparat, au dialogue des matières nobles et à l’élégance cérémoniale.
        </p>

        {/* Global Delivery Assurance */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#9E7A45] font-medium">
          <Globe className="w-3.5 h-3.5" />
          <span>Atelier à Douala · Confection & Expéditions dans tout le Cameroun, en Europe et au Canada</span>
        </div>
      </section>

      {/* Le Créateur & 11 Années d'Expérience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-sm overflow-hidden border border-[#E8E2D9] shadow-2xl group">
            <Image
              src="/images/creations/costume-ceremonie-blanc-rouge.jpg"
              alt="Maître Couturier YANLAMODE"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10]/85 via-[#0E0E10]/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold block">
                Maître Couturier & Directeur Artistique
              </span>
              <p className="font-serif-luxe text-2xl text-white">
                YANLAMODE Haute Couture
              </p>
              <p className="text-xs text-white/80 font-mono pt-1">
                +237 6 97 25 14 25 · Douala, Cameroun
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-[#E8E2D9] shadow-sm rounded-full text-[#0E0E10] text-xs uppercase tracking-[0.2em] font-medium">
              <Award className="w-4 h-4 text-[#C5A880]" />
              <span>11 Années de Dévotion au Vêtement d'Apparat</span>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif-luxe text-3xl sm:text-4xl md:text-5xl text-[#0E0E10] leading-tight">
                L’amour du beau geste, la rigueur géométrique et l'élégance souveraine.
              </h2>
              <p className="text-sm text-[#666360] leading-relaxed font-light">
                Fort de plus d’une décennie d’expérience au cœur des ateliers de confection, le créateur de YANLAMODE a façonné une signature reconnaissable entre toutes : des lignes épurées, des épaules structurées et un tombé impeccable qui confère instantanément majesté et assurance.
              </p>
              <p className="text-sm text-[#666360] leading-relaxed font-light">
                Chaque création réconcilie les exigences du grand patronage classique avec la richesse des héritages textiles d'Afrique : draps de laine italiens, broderies d'or fin, soies lustrées et batiks graphiques se répondent dans une harmonie parfaite.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E8E2D9]">
              <div>
                <p className="font-serif-luxe text-3xl sm:text-4xl text-[#C5A880] font-normal">11+</p>
                <p className="text-[10px] text-[#73706B] uppercase tracking-[0.2em] mt-1">Années de maîtrise</p>
              </div>
              <div>
                <p className="font-serif-luxe text-3xl sm:text-4xl text-[#0E0E10] font-normal">100%</p>
                <p className="text-[10px] text-[#73706B] uppercase tracking-[0.2em] mt-1">Fait Main & Sur-Mesure</p>
              </div>
              <div>
                <p className="font-serif-luxe text-3xl sm:text-4xl text-[#C5A880] font-normal">03</p>
                <p className="text-[10px] text-[#73706B] uppercase tracking-[0.2em] mt-1">Zones (Cameroun, Europe, Canada)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savoir-Faire en 7 Étapes */}
      <section className="bg-white border-y border-[#E8E2D9] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Rigueur & Méticulosité
            </span>
            <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#0E0E10]">
              Le Processus des 7 Étapes
            </h2>
            <p className="text-xs sm:text-sm text-[#666360] font-light leading-relaxed">
              De l’idée initiale jusqu’au dernier point de broderie fait main, découvrez le parcours initiatique de chaque tenue d'apparat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STEPS.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-8 bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#C5A880] hover:shadow-xl transition-all duration-500 rounded-sm space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-luxe text-3xl text-[#C5A880]/70 group-hover:text-[#C5A880] transition-colors">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-full bg-white border border-[#E8E2D9] group-hover:border-[#C5A880] transition-colors">
                      <IconComp className="w-4 h-4 text-[#C5A880]" />
                    </div>
                  </div>
                  <h3 className="font-serif-luxe text-xl text-[#0E0E10] group-hover:text-[#9E7A45] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#666360] font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
            Éthique & Exigence
          </span>
          <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#0E0E10]">
            Les Valeurs de la Maison
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {VALUES.map((val) => (
            <div
              key={val.title}
              className="p-6 bg-white border border-[#E8E2D9] rounded-sm text-center space-y-3 shadow-sm hover:border-[#C5A880] transition-all hover:-translate-y-1 duration-300"
            >
              <h3 className="font-serif-luxe text-base text-[#0E0E10] uppercase tracking-wider font-semibold">
                {val.title}
              </h3>
              <p className="text-xs text-[#666360] font-light leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-10 text-center space-y-3">
          <a
            href={generateWhatsAppLink({ type: 'contact' })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { path: '/la-maison' })}
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#0E0E10] text-[#FAF8F5] border border-[#C5A880]/50 font-semibold text-xs uppercase tracking-[0.24em] rounded-sm hover:bg-[#C5A880] hover:text-[#0E0E10] transition-all shadow-xl hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            <span>COMMANDER & PRENDRE RENDEZ-VOUS</span>
          </a>
          <p className="text-[11px] text-[#73706B] font-mono">
            WhatsApp : +237 6 97 25 14 25
          </p>
        </div>
      </section>
    </div>
  );
}
