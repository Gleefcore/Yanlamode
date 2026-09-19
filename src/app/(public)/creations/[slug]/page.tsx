'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Creation } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import GalleryModal from '@/components/public/GalleryModal';
import {
  ShoppingBag,
  Heart,
  Search,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Scissors,
  Layers,
  Sparkles,
  ChevronDown,
  Star,
  ArrowRight,
  Maximize2,
  Check,
  Globe,
} from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Sur-Mesure'];

export default function CreationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [creation, setCreation] = useState<Creation | null>(null);
  const [allCreations, setAllCreations] = useState<Creation[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Interactive selectors matching VELORA design
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'size' | 'shipping'>('details');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/creations');
        const list: Creation[] = await res.json();
        setAllCreations(list);
        const found = list.find((c) => c.slug === slug);
        if (found) {
          setCreation(found);
          setSelectedColor(found.colors[0] || 'Noir Profond');
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
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-gray-500 uppercase tracking-widest font-medium">
        Chargement de la création...
      </div>
    );
  }

  if (!creation) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Création Introuvable</h1>
        <p className="text-xs text-gray-500">Cette silhouette n’existe pas ou a été archivée.</p>
        <Link
          href="/creations"
          className="px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider rounded-xl font-semibold"
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
      color: selectedColor,
      size: selectedSize,
    });
  };

  // WhatsApp order URL tailored with selected size and color
  const dynamicWhatsAppUrl = generateWhatsAppLink({
    type: 'creation',
    creationTitle: creation.title,
    creationRef: creation.ref,
    availability: creation.status,
    fabric: creation.fabric,
    deliveryLocation: 'Partout au Cameroun / Europe / Canada',
    customDetails: {
      outfitType: `${creation.title} (Taille : ${selectedSize}, Teinte : ${selectedColor})`,
    },
  });

  // Color circles metadata
  const colorMap: Record<string, string> = {
    'Noir Profond': '#171717',
    'Noir': '#171717',
    'Or': '#C5A880',
    'Or Impérial': '#C5A880',
    'Blanc': '#FAF8F5',
    'Blanc Pur': '#FFFFFF',
    'Rose Poudré': '#F3C5C5',
    'Vert Sauge': '#8A9A86',
    'Indigo': '#312E81',
    'Violet': '#581C87',
  };

  const relatedCreations = allCreations.filter((c) => c.id !== creation.id).slice(0, 4);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Top Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href="/creations" className="hover:text-gray-900 transition-colors">Créations</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate">{creation.title}</span>
      </nav>

      {/* Hero Product Presentation (Exact VELORA Structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Vertical Thumbnails + Big Hero Product Display */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
          {/* Vertical Thumbnail Rail (VELORA Left) */}
          <div className="flex sm:flex-col gap-3 shrink-0 overflow-x-auto sm:overflow-visible w-full sm:w-20">
            {creation.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImageIndex === idx
                    ? 'border-gray-900 shadow-sm'
                    : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
            {creation.images.length > 3 && (
              <div className="hidden sm:flex items-center justify-center p-2 text-gray-400 hover:text-gray-700 cursor-pointer">
                <ChevronDown className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Large Main Display (VELORA Big Image with Zoom Icon) */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F3F4F6] border border-gray-200/80 shadow-sm group">
            <Image
              src={creation.images[selectedImageIndex] || '/images/creations/costume-croise-rose.jpg'}
              alt={creation.title}
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Zoom Icon Button at bottom right (Exact VELORA placement) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-4 right-4 p-3 bg-white/95 hover:bg-white text-gray-900 rounded-full shadow-md border border-gray-200/80 transition-all hover:scale-110"
              title="Agrandir en plein écran"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Product Details, Selectors & Actions (Exact VELORA Structure) */}
        <div className="lg:col-span-5 space-y-6">
          {/* New Arrival / Collection Tag */}
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md uppercase tracking-wider">
              {creation.category} · {creation.gender}
            </span>
          </div>

          {/* Product Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {creation.title}
            </h1>
            <p className="text-xs text-[#8C6D42] font-mono mt-1 font-semibold">
              RÉFÉRENCE : {creation.ref}
            </p>
          </div>

          {/* Rating & Reviews (VELORA Style) */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-bold text-gray-900">5.0</span>
            <span className="text-gray-500">(48 avis certifiés · Salon Privé)</span>
          </div>

          {/* Price & Discount Pill (VELORA Style) */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Sur-Mesure
            </span>
            <span className="text-sm text-gray-400 line-through">Haute Couture</span>
            <span className="px-2.5 py-0.5 rounded-md bg-black text-white text-xs font-bold uppercase">
              Devis Privé
            </span>
          </div>

          {/* Crisp Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            {creation.description}
          </p>

          {/* Color Selector (VELORA Style) */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-900">
                Couleur : <span className="font-normal text-gray-600">{selectedColor}</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {creation.colors.map((colorName) => {
                const isSelected = selectedColor === colorName;
                const bg = colorMap[colorName] || '#262626';
                return (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() => setSelectedColor(colorName)}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-gray-900 ring-offset-2 scale-110 shadow-sm'
                        : 'border border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: bg }}
                    title={colorName}
                  >
                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 ${bg === '#FFFFFF' || bg === '#FAF8F5' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector with Size Guide Link (VELORA Style) */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-900">
                Taille : <span className="font-normal text-gray-600">{selectedSize}</span>
              </span>
              <Link
                href="/sur-mesure"
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium underline underline-offset-4"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Guide des tailles</span>
              </Link>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all text-center ${
                    selectedSize === s
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'border border-gray-200 text-gray-800 hover:border-gray-900 bg-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button: COMMANDER + Wishlist (Exact VELORA Layout) */}
          <div className="flex items-center gap-3 pt-3">
            <a
              href={dynamicWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOrderClick}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:scale-[1.01]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>COMMANDER</span>
            </a>

            <button
              type="button"
              onClick={() => setIsWishlist(!isWishlist)}
              className={`p-4 rounded-2xl border transition-all ${
                isWishlist
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-200 text-gray-700 hover:border-gray-900 bg-white'
              }`}
              title="Ajouter aux favoris"
            >
              <Heart className={`w-5 h-5 ${isWishlist ? 'fill-current text-red-500' : ''}`} />
            </button>
          </div>

          {/* 3 Reassurance Features (VELORA Style) */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-[11px] text-gray-600">
            <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-gray-50">
              <Truck className="w-4 h-4 text-gray-800" />
              <span className="font-semibold text-gray-900">Expédition Sécurisée</span>
              <span className="text-[10px] text-gray-500">Cameroun, Europe, Canada</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-gray-50">
              <Scissors className="w-4 h-4 text-gray-800" />
              <span className="font-semibold text-gray-900">Sur-Mesure Pur</span>
              <span className="text-[10px] text-gray-500">Ajustement garanti</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-gray-50">
              <ShieldCheck className="w-4 h-4 text-gray-800" />
              <span className="font-semibold text-gray-900">Atelier Privé</span>
              <span className="text-[10px] text-gray-500">+237 6 97 25 14 25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Below Fold Tabs (Exact VELORA Tabs & Macro Zoom Photo) */}
      <div className="space-y-8 pt-8 border-t border-gray-200">
        {/* Tab Headers with Active Underline */}
        <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto scrollbar-none">
          {[
            { id: 'details', label: 'Details' },
            { id: 'materials', label: 'Materials' },
            { id: 'size', label: 'Size & Fit' },
            { id: 'shipping', label: 'Shipping & Returns' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-sm font-semibold transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Diptych: Left Checklist + Right Macro Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Description & Bullet Checklist */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              Façonnée avec un soin absolu dans notre atelier au Cameroun, cette pièce de haute couture incarne la pureté des lignes tailleur et la noblesse des étoffes d'exception. Chaque coupe est étudiée pour offrir prestance et aisance à chaque mouvement.
            </p>

            <div className="space-y-3.5 text-xs text-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                  <Scissors className="w-4 h-4" />
                </div>
                <span>Coupe architecturale et tombé impeccable</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                  <Layers className="w-4 h-4" />
                </div>
                <span>Matière noble : {creation.fabric || 'Drap de laine superfine & soies pures'}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Finitions joaillerie et boutonnières faites à la main</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                  <Ruler className="w-4 h-4" />
                </div>
                <span>Patronage personnalisé selon vos mensurations</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                  <Globe className="w-4 h-4" />
                </div>
                <span>Expéditions sécurisées au Cameroun, en Europe et au Canada</span>
              </div>
            </div>
          </div>

          {/* Right Column: Macro Detail Zoom (VELORA Texture Photo) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
              <Image
                src={creation.images[0]}
                alt="Macro détail tissu et broderie"
                fill
                className="object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880] block">
                  Finitions Atelier
                </span>
                <p className="font-serif-luxe text-2xl font-bold">YANLAMODE HAUTE COUTURE</p>
                <p className="text-xs text-white/80 font-light">11 Années de Maîtrise & Confection Artisanale</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section (Exact VELORA 4-Column Cards) */}
      <div className="space-y-6 pt-10 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            You May Also Like
          </h2>
          <Link
            href="/creations"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 hover:text-[#8C6D42] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedCreations.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/70 hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/creations/${item.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </Link>

              <div className="p-4 space-y-1">
                <Link href={`/creations/${item.slug}`} className="block">
                  <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#8C6D42] transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{item.category}</span>
                  <span className="font-bold text-gray-900">Sur-Mesure</span>
                </div>
              </div>
            </div>
          ))}
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
