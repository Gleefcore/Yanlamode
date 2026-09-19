export type CreationStatus = 'Disponible sur commande' | 'Création sur mesure' | 'Indisponible';

export type CreationCategory = 'Haute Couture' | 'Sur mesure' | 'Cérémonie' | 'Mariage' | 'Traditionnel Chic' | 'Costume & Smoking';

export type GenderCategory = 'Homme' | 'Femme' | 'Unisexe';

export interface Creation {
  id: string;
  title: string;
  slug: string;
  ref: string;
  collectionId: string;
  category: CreationCategory;
  gender: GenderCategory;
  description: string;
  fabric: string;
  colors: string[];
  status: CreationStatus;
  images: string[];
  featured: boolean;
  viewsCount: number;
  whatsappClicksCount: number;
  createdAt: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  season?: string;
  featured: boolean;
  creationsCount?: number;
}

export type DemandStatus = 'Nouveau' | 'En discussion' | 'Devis / Proposition' | 'Confirmé' | 'Terminé';

export type DemandType = 'creation' | 'sur-mesure' | 'contact' | 'formation';

export interface Demand {
  id: string;
  type: DemandType;
  fullName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  creationId?: string;
  creationTitle?: string;
  gender?: GenderCategory;
  outfitType?: string;
  occasion?: string;
  eventDate?: string;
  budget?: string;
  deliveryLocation?: string;
  trainingDuration?: string;
  motivation?: string;
  measurements?: {
    chest?: string;
    waist?: string;
    hips?: string;
    shoulder?: string;
    armLength?: string;
    height?: string;
    notes?: string;
  };
  description: string;
  inspirationImages?: string[];
  status: DemandStatus;
  notes?: string;
  createdAt: string;
}

export type TrafficSource = 'Instagram' | 'Facebook' | 'TikTok' | 'Google' | 'WhatsApp' | 'Direct' | 'Autre';

export type DeviceType = 'Mobile' | 'Desktop' | 'Tablette';

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'creation_view' | 'whatsapp_click' | 'demand_submit';
  path: string;
  creationId?: string;
  creationTitle?: string;
  source?: TrafficSource;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  device?: DeviceType;
  timestamp: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  secondaryTagline: string;
  experienceYears: number;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  country: string;
  hours: string;
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}
