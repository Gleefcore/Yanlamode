import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#9E7A45] hover:text-[#111111] uppercase tracking-wider font-semibold transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l'accueil</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
          Protection des Données Personnelles
        </span>
        <h1 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111]">
          Politique de Confidentialité
        </h1>
      </div>

      <div className="space-y-6 text-xs text-[#666666] leading-relaxed border-t border-[#E5DFD7] pt-8 bg-[#FFFFFF] p-8 rounded-sm shadow-sm border border-[#E5DFD7]">
        <section className="space-y-2">
          <h2 className="font-serif-luxe text-lg text-[#111111]">1. Données Recueillies</h2>
          <p>
            Dans le cadre de la prise de commande sur mesure et de la mise en relation, YANLAMODE peut collecter les informations suivantes : nom, prénom, numéro de téléphone, WhatsApp, adresse email, mensurations anatomiques, descriptif du projet et photographies d’inspiration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxe text-lg text-[#111111]">2. Finalité des Traitements</h2>
          <p>
            Ces données sont exclusivement utilisées pour la confection de vos pièces personnalisées, l’établissement des devis, le suivi des essayages et les échanges directs via notre canal WhatsApp sécurisé. Elles ne sont jamais cédées ou vendues à des tiers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxe text-lg text-[#111111]">3. Droits d'Accès et de Rectification</h2>
          <p>
            Conformément aux réglementations sur la protection des données personnelles, vous disposez d’un droit permanent d’accès, de modification et de suppression de vos données sur simple demande à contact@yanlamode.com.
          </p>
        </section>
      </div>
    </div>
  );
}
