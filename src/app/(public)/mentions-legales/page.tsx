import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#9E7A45] hover:text-[#111111] uppercase tracking-wider font-semibold transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l'accueil</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
          Informations Réglementaires
        </span>
        <h1 className="font-serif-luxe text-3xl sm:text-5xl text-[#111111]">
          Mentions Légales
        </h1>
      </div>

      <div className="space-y-6 text-xs text-[#666666] leading-relaxed border-t border-[#E5DFD7] pt-8 bg-[#FFFFFF] p-8 rounded-sm shadow-sm border border-[#E5DFD7]">
        <section className="space-y-2">
          <h2 className="font-serif-luxe text-lg text-[#111111]">1. Éditeur de la Plateforme</h2>
          <p>
            Le site officiel <strong>YANLAMODE Haute Couture</strong> est édité par la maison de couture YANLAMODE, sous la direction de son Maître Créateur et Couturier.
          </p>
          <p>Courriel : contact@yanlamode.com | Téléphone : +237 6 97 25 14 25 (Cameroun)</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxe text-lg text-[#111111]">2. Propriété Intellectuelle & Modèles</h2>
          <p>
            L’intégralité des créations, modèles présentés, photographies, patronages, textes, logos et éléments graphiques constitue des œuvres de l'esprit protégées par les dispositions du Code de la Propriété Intellectuelle. Toute reproduction, contrefaçon ou imitation des modèles sans autorisation écrite préalable est strictement prohibée.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxe text-lg text-[#111111]">3. Hébergement</h2>
          <p>
            Cette application web est hébergée sur une infrastructure Cloud haute sécurité avec persistance de données distribuée (PostgreSQL Supabase).
          </p>
        </section>
      </div>
    </div>
  );
}
