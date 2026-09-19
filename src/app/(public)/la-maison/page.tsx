'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Scissors, Sparkles, CheckCircle2, MessageCircle, Ruler, Layers, Eye, HeartHandshake } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

const STEPS = [
  {
    num: '01',
    title: 'Conception & Silhouette',
    desc: 'Échange intime autour de votre personnalité, de votre morphologie et de l’événement pour définir l’esquisse parfaite.',
    icon: Eye,
  },
  {
    num: '02',
    title: 'Choix des Matières Nobles',
    desc: 'Sélection des plus beaux draps de laine italiens, soies naturelles, dentelles suisses ajourées et batiks artisanaux exclusifs.',
    icon: Layers,
  },
  {
    num: '03',
    title: 'Coupe & Patronage Artisanal',
    desc: 'Tracé millimétré à la craie et découpe manuelle des pièces pour assurer un tombé impeccable.',
    icon: Scissors,
  },
  {
    num: '04',
    title: 'Assemblage & Bâtissage',
    desc: 'Montage traditionnel à points souples pour conférer au vêtement sa structure et son maintien naturel.',
    icon: Ruler,
  },
  {
    num: '05',
    title: 'Ajustement & Essayage Privé',
    desc: 'Retouches sur le corps du client pour épouser chaque courbe avec aisance et prestance.',
    icon: Sparkles,
  },
  {
    num: '06',
    title: 'Finitions de Haute Précision',
    desc: 'Boutonnières faites main, boutons dorés ciselés, revers surpiqués et doublures en satin fluide.',
    icon: CheckCircle2,
  },
  {
    num: '07',
    title: 'Personnalisation & Signature',
    desc: 'Initiales brodées, détails uniques et remise de la création sous housse de protection haute couture.',
    icon: HeartHandshake,
  },
];

const VALUES = [
  { title: 'Excellence', desc: 'Une exigence absolue sur chaque couture, chaque couture et chaque détail intérieur invisible.' },
  { title: 'Créativité', desc: 'La rencontre audacieuse entre lignes européennes épurées et noblesse des étoffes africaines.' },
  { title: 'Précision', desc: 'Un patronage rigoureux et une coupe taillée pour sublimer sans jamais contraindre le mouvement.' },
  { title: 'Personnalisation', desc: 'Chaque pièce raconte une histoire unique : la vôtre.' },
  { title: 'Élégance', desc: 'Une distinction intemporelle qui traverse les modes avec force et majesté.' },
];

export default function LaMaisonPage() {
  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero La Maison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
          Maison de Couture Fondée sur l’Excellence
        </span>
        <h1 className="font-serif-luxe text-4xl sm:text-6xl md:text-7xl text-[#111111]">
          La Maison YANLAMODE
        </h1>
        <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto font-light leading-relaxed">
          11 années consacrées à l’art du tailleur, à la géométrie de la silhouette et à l’ennoblissement des textiles d’exception.
        </p>
      </section>

      {/* Le Créateur & 11 Années d'Expérience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-sm overflow-hidden border border-[#E5DFD7] shadow-lg">
            <Image
              src="/images/creations/costume-ceremonie-blanc-rouge.jpg"
              alt="Le Créateur YANLAMODE"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                Maître Couturier & Fondateur
              </span>
              <p className="font-serif-luxe text-2xl text-white">
                YANLAMODE Haute Couture
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#FFFFFF] border border-[#C5A880]/60 shadow-sm rounded-full text-[#9E7A45] text-xs uppercase tracking-widest font-semibold">
              <Award className="w-4 h-4 text-[#C5A880]" />
              <span>11 Années de Savoir-Faire Éprouvé</span>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif-luxe text-3xl sm:text-4xl md:text-5xl text-[#111111] leading-tight">
                L’amour du beau geste et de la rigueur artisanale.
              </h2>
              <p className="text-sm text-[#555555] leading-relaxed">
                Fort de plus d’une décennie d’expérience au cœur des ateliers de confection, le créateur de YANLAMODE s’est imposé comme une référence incontournable de la couture masculine et féminine d’apparat.
              </p>
              <p className="text-sm text-[#777777] leading-relaxed">
                Inspiré à la fois par la rigueur du tailoring britannique, la sensualité de la coupe italienne et la majesté intemporelle des étoffes d’Afrique de l’Ouest, il façonne des pièces qui ne sont pas de simples vêtements, mais de véritables parures de prestige.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E5DFD7]">
              <div>
                <p className="font-serif-luxe text-3xl sm:text-4xl text-[#C5A880] font-medium">11+</p>
                <p className="text-xs text-[#777777] uppercase tracking-wider mt-1">Années d’expérience</p>
              </div>
              <div>
                <p className="font-serif-luxe text-3xl sm:text-4xl text-[#111111]">100%</p>
                <p className="text-xs text-[#777777] uppercase tracking-wider mt-1">Confection sur mesure</p>
              </div>
              <div>
                <p className="font-serif-luxe text-3xl sm:text-4xl text-[#C5A880] font-medium">7</p>
                <p className="text-xs text-[#777777] uppercase tracking-wider mt-1">Étapes de rigueur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savoir-Faire en 7 Étapes */}
      <section className="bg-[#F5F1EA]/70 border-y border-[#E5DFD7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Rigueur & Précision
            </span>
            <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111]">
              Notre Savoir-Faire
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Découvrez les 7 étapes fondamentales à travers lesquelles chaque création YANLAMODE prend vie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STEPS.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-8 bg-[#FFFFFF] border border-[#E5DFD7] hover:border-[#C5A880] hover:shadow-md transition-all rounded-sm space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-luxe text-3xl text-[#C5A880]/60 group-hover:text-[#C5A880] transition-colors">
                      {step.num}
                    </span>
                    <IconComp className="w-5 h-5 text-[#C5A880]" />
                  </div>
                  <h3 className="font-serif-luxe text-xl text-[#111111] group-hover:text-[#9E7A45] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
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
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
            Ce qui nous anime
          </span>
          <h2 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111]">
            Nos Valeurs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {VALUES.map((val) => (
            <div
              key={val.title}
              className="p-6 bg-[#FFFFFF] border border-[#E5DFD7] rounded-sm text-center space-y-3 shadow-sm hover:border-[#C5A880]/60 transition-colors"
            >
              <h3 className="font-serif-luxe text-base text-[#9E7A45] uppercase tracking-wider font-semibold">
                {val.title}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action WhatsApp */}
        <div className="pt-10 text-center">
          <a
            href={generateWhatsAppLink({ type: 'contact' })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { path: '/la-maison' })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#111111] text-[#FAF8F5] border border-[#C5A880]/50 font-semibold text-xs uppercase tracking-[0.25em] rounded-sm hover:bg-[#C5A880] hover:text-[#111111] transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Commander & Prendre rendez-vous</span>
          </a>
        </div>
      </section>
    </div>
  );
}
