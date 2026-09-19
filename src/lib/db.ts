import { Creation, Collection, Demand, AnalyticsEvent, SiteSettings } from './types';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';

// Base de données par défaut riche et fonctionnelle
const INITIAL_SETTINGS: SiteSettings = {
  brandName: "YANLAMODE HAUTE COUTURE",
  tagline: "L’élégance façonnée sur mesure.",
  secondaryTagline: "11 années de savoir-faire au service de créations uniques.",
  experienceYears: 11,
  whatsappNumber: "+237697251425", // Modifiable dans le dashboard
  phoneNumber: "+237 6 97 25 14 25",
  email: "contact@yanlamode.com",
  address: "Atelier Haute Couture, Cameroun",
  city: "Douala / Yaoundé",
  country: "Cameroun (Livraisons : Cameroun, Europe, Canada)",
  hours: "Lun - Sam : 09h00 - 19h00 (Sur rendez-vous)",
  socials: {
    instagram: "https://instagram.com/yanlamode",
    facebook: "https://facebook.com/yanlamode",
    tiktok: "https://tiktok.com/@yanlamode",
    whatsapp: "https://wa.me/237697251425",
  },
  seo: {
    metaTitle: "YANLAMODE HAUTE COUTURE | L'élégance façonnée sur mesure",
    metaDescription: "Maison de couture d'exception avec 11 ans de savoir-faire. Créations sur mesure pour hommes et femmes, cérémonies, smokings et pièces de prestige.",
    keywords: [
      "YANLAMODE Haute Couture",
      "couturier sur mesure",
      "haute couture homme",
      "haute couture femme",
      "smoking sur mesure",
      "tenue de cérémonie",
      "mode africaine haut de gamme",
      "couturier 11 ans expérience"
    ],
  },
};

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "col-haute-couture",
    title: "Haute Couture",
    slug: "haute-couture",
    description: "Créations d'exception pensées dans les moindres détails pour sublimer la silhouette avec une audace raffinée.",
    coverImage: "/images/creations/robe-batik-franges.jpg",
    season: "Édition Permanente",
    featured: true,
    creationsCount: 4,
  },
  {
    id: "col-ceremonie",
    title: "Cérémonie & Soirée",
    slug: "ceremonie",
    description: "Des silhouettes magistrales pensées pour les moments inoubliables. Smokings impeccables et tenues d'apparat.",
    coverImage: "/images/creations/smoking-noir-prestige.jpg",
    season: "Collection Prestige",
    featured: true,
    creationsCount: 4,
  },
  {
    id: "col-tradition-chic",
    title: "Héritage & Tradition Chic",
    slug: "tradition-chic",
    description: "L'art du textile d'Afrique magnifié par la précision et la rigueur de la haute couture moderne.",
    coverImage: "/images/creations/agbada-noir-diamant.jpg",
    season: "Collection Signature",
    featured: true,
    creationsCount: 3,
  },
  {
    id: "col-sur-mesure",
    title: "Sur Mesure Exclusif",
    slug: "sur-mesure",
    description: "Une pièce unique imaginée selon vos envies, votre morphologie exacte et vos événements les plus précieux.",
    coverImage: "/images/creations/costume-croise-rose.jpg",
    season: "Atelier Privé",
    featured: true,
    creationsCount: 10,
  },
];

const INITIAL_CREATIONS: Creation[] = [
  {
    id: "crea-01",
    title: "Costume Croisé Rose Poudré & Boutons d'Or",
    slug: "costume-croise-rose-poudre-et-or",
    ref: "YM-HC-001",
    collectionId: "col-ceremonie",
    category: "Costume & Smoking",
    gender: "Homme",
    description: "Veste croisée masculine ajustée dans une teinte rose poudré subtile et moderne, rehaussée de boutons dorés brossés et d'une pochette en soie à motifs géométriques.",
    fabric: "Drap de laine froide superfine 150s & doublure satin de soie",
    colors: ["Rose Poudré", "Boutons Or", "Blanc Soie"],
    status: "Disponible sur commande",
    images: ["/images/creations/costume-croise-rose.jpg"],
    featured: true,
    viewsCount: 342,
    whatsappClicksCount: 48,
    createdAt: "2026-08-01",
  },
  {
    id: "crea-02",
    title: "Smoking Vert Sauge Col Châle Arrondi",
    slug: "smoking-vert-sauge-col-chale",
    ref: "YM-HC-002",
    collectionId: "col-ceremonie",
    category: "Costume & Smoking",
    gender: "Homme",
    description: "Smoking couture à col châle généreux et arrondi dans une nuance vert sauge contemporaine. Boutons recouverts de tissu ton sur ton et fentes discrètes.",
    fabric: "Laine italienne peignée & revers satin mat",
    colors: ["Vert Sauge", "Noir Satin"],
    status: "Création sur mesure",
    images: ["/images/creations/smoking-vert-sauge.jpg"],
    featured: true,
    viewsCount: 289,
    whatsappClicksCount: 39,
    createdAt: "2026-08-05",
  },
  {
    id: "crea-03",
    title: "Agbada Haute Couture Noir Relief Diamant",
    slug: "agbada-haute-couture-noir-relief",
    ref: "YM-HC-003",
    collectionId: "col-tradition-chic",
    category: "Traditionnel Chic",
    gender: "Homme",
    description: "Ensemble d'apparat masculin composé d'un agbada à structure matelassée en losanges géométriques, pantalon tailleur assorti et coiffe traditionnelle.",
    fabric: "Coton damassé texturé lourd & finitions au fil de soie",
    colors: ["Noir Profond"],
    status: "Disponible sur commande",
    images: ["/images/creations/agbada-noir-diamant.jpg"],
    featured: true,
    viewsCount: 520,
    whatsappClicksCount: 76,
    createdAt: "2026-08-10",
  },
  {
    id: "crea-04",
    title: "Smoking Croisé Noir Prestige & Revers Satin",
    slug: "smoking-croise-noir-prestige",
    ref: "YM-HC-004",
    collectionId: "col-ceremonie",
    category: "Costume & Smoking",
    gender: "Homme",
    description: "Le summum de l'élégance formelle. Veste croisée noire au tombé sculptural, revers en satin de soie noir brillant et nœud papillon en velours.",
    fabric: "Laine noble mérinos & satin de soie duchesse",
    colors: ["Noir Intense", "Blanc Pur"],
    status: "Disponible sur commande",
    images: ["/images/creations/smoking-noir-prestige.jpg"],
    featured: true,
    viewsCount: 461,
    whatsappClicksCount: 63,
    createdAt: "2026-08-14",
  },
  {
    id: "crea-05",
    title: "Ensemble Épure Blanc Brodé Volière & Oiseaux",
    slug: "ensemble-epure-blanc-brode-voliere",
    ref: "YM-HC-005",
    collectionId: "col-haute-couture",
    category: "Haute Couture",
    gender: "Homme",
    description: "Tunique oversize à manches courtes en lin immaculé ornée d'une broderie d'art figurant une cage et des oiseaux prenant leur envol, avec pantalon à pinces fluide.",
    fabric: "Lin lourd premium & broderie d'art au point de croix",
    colors: ["Blanc Craie", "Noir de Chine"],
    status: "Disponible sur commande",
    images: ["/images/creations/ensemble-blanc-oiseau.jpg"],
    featured: true,
    viewsCount: 395,
    whatsappClicksCount: 52,
    createdAt: "2026-08-18",
  },
  {
    id: "crea-06",
    title: "Gilet d'Apparat Croisé & Coiffe Royale",
    slug: "gilet-apparat-croise-blanc-coiffe",
    ref: "YM-HC-006",
    collectionId: "col-ceremonie",
    category: "Cérémonie",
    gender: "Homme",
    description: "Gilet long sans manches croisé blanc immaculé sur chemise rayée à manchettes montantes, complété d'une coiffe royale en velours rouge brodée d'or.",
    fabric: "Crêpe de laine blanc nacré & velours de soie pourpre",
    colors: ["Blanc Éclatant", "Bleu Rayé", "Rouge Impérial"],
    status: "Création sur mesure",
    images: ["/images/creations/costume-ceremonie-blanc-rouge.jpg"],
    featured: true,
    viewsCount: 310,
    whatsappClicksCount: 41,
    createdAt: "2026-08-22",
  },
  {
    id: "crea-07",
    title: "Robe Tunique Batik Indigo & Plastron Tissé",
    slug: "robe-tunique-batik-indigo-plastron-tisse",
    ref: "YM-HC-007",
    collectionId: "col-haute-couture",
    category: "Haute Couture",
    gender: "Femme",
    description: "Création spectaculaire mêlant batik contemporain à motifs marbrés verticaux et plastron artisanal tissé main à rayures et franges vibrantes.",
    fabric: "Batik artisanal coton peigné & tissage traditionnel Baoulé",
    colors: ["Indigo Nuit", "Écru Naturel", "Rouge Terre"],
    status: "Disponible sur commande",
    images: ["/images/creations/robe-batik-franges.jpg"],
    featured: true,
    viewsCount: 488,
    whatsappClicksCount: 67,
    createdAt: "2026-08-25",
  },
  {
    id: "crea-08",
    title: "Tunique Haute Couture Dentelle Suisse Ajourée",
    slug: "tunique-dentelle-suisse-ajouree",
    ref: "YM-HC-008",
    collectionId: "col-tradition-chic",
    category: "Traditionnel Chic",
    gender: "Homme",
    description: "Tunique masculine prestigieuse en dentelle suisse perforée à motifs géométriques et œillets d'art, boutonnage discret à col officier.",
    fabric: "Véritable dentelle suisse de coton brodé ajouré",
    colors: ["Blanc Pur"],
    status: "Disponible sur commande",
    images: ["/images/creations/tunique-dentelle-suisse.jpg"],
    featured: false,
    viewsCount: 275,
    whatsappClicksCount: 33,
    createdAt: "2026-08-28",
  },
  {
    id: "crea-09",
    title: "Robe Maxi Batik Majesté & Plastron Cuivré",
    slug: "robe-maxi-batik-majeste-plastron-cuivre",
    ref: "YM-HC-009",
    collectionId: "col-haute-couture",
    category: "Haute Couture",
    gender: "Femme",
    description: "Robe longue architecturale avec découpes en wax batik indigo et écru, plastron asymétrique cuivré métallisé et coiffe assortie.",
    fabric: "Batik authentique teinté à la cuve & soie mordorée",
    colors: ["Bleu Nuit", "Bronze Cuivre", "Blanc Craie"],
    status: "Création sur mesure",
    images: ["/images/creations/robe-maxi-batik-bronze.jpg"],
    featured: true,
    viewsCount: 390,
    whatsappClicksCount: 54,
    createdAt: "2026-09-02",
  },
  {
    id: "crea-10",
    title: "Robe Éditoriale Batik Géométrique & Voile Violet",
    slug: "robe-editoriale-batik-violet",
    ref: "YM-HC-010",
    collectionId: "col-haute-couture",
    category: "Haute Couture",
    gender: "Femme",
    description: "Robe kimono fluide associant motifs floraux géométriques indigo, col officier graphique et ourlet inférieur teinté en violet pourpre.",
    fabric: "Coton batik bicolore et soie satinée violette",
    colors: ["Indigo", "Violet Pourpre", "Lavande"],
    status: "Disponible sur commande",
    images: ["/images/creations/robe-tunique-violet-indigo.jpg"],
    featured: false,
    viewsCount: 330,
    whatsappClicksCount: 42,
    createdAt: "2026-09-05",
  },
];

const INITIAL_DEMANDS: Demand[] = [
  {
    id: "dem-001",
    type: "sur-mesure",
    fullName: "Alexandre Koffi",
    phone: "+237 6 97 25 14 25",
    whatsapp: "+237 6 97 25 14 25",
    email: "alex.koffi@example.com",
    gender: "Homme",
    outfitType: "Smoking de Gala sur mesure",
    occasion: "Cérémonie de Mariage",
    eventDate: "2026-10-25",
    budget: "450 000 - 650 000 FCFA",
    measurements: {
      chest: "102 cm",
      waist: "86 cm",
      shoulder: "48 cm",
      height: "185 cm",
    },
    description: "Je recherche un smoking dans l'esprit du Vert Sauge mais en bleu nuit profond avec revers satin noir et pochette personnalisée.",
    status: "En discussion",
    notes: "Premier contact très favorable. Échange WhatsApp en cours pour convenir de la date de prise de mesures.",
    createdAt: "2026-09-15T14:30:00Z",
  },
  {
    id: "dem-002",
    type: "creation",
    fullName: "Béatrice Touré",
    phone: "+33 6 12 34 56 78",
    whatsapp: "+33 6 12 34 56 78",
    email: "beatrice.toure@example.com",
    creationId: "crea-07",
    creationTitle: "Robe Tunique Batik Indigo & Plastron Tissé",
    description: "Bonjour, je souhaite commander cette robe pour une réception officielle à Paris fin octobre. Est-il possible d'ajuster la longueur ?",
    status: "Nouveau",
    notes: "Demande reçue directement depuis la fiche création. Relancer sur WhatsApp.",
    createdAt: "2026-09-17T09:15:00Z",
  },
  {
    id: "dem-003",
    type: "sur-mesure",
    fullName: "Emmanuel Mbarga",
    phone: "+237 6 97 25 14 25",
    whatsapp: "+237 6 97 25 14 25",
    gender: "Homme",
    outfitType: "Agbada 3 pièces Cérémonie",
    occasion: "Dot traditionnelle",
    eventDate: "2026-11-12",
    budget: "300 000 - 400 000 FCFA",
    description: "Agbada noir chic avec broderie fine dorée sur le col.",
    status: "Devis / Proposition",
    notes: "Devis envoyé sur WhatsApp (350 000 FCFA avec tissu importé). En attente d'acompte.",
    createdAt: "2026-09-12T16:00:00Z",
  },
  {
    id: "dem-004",
    type: "creation",
    fullName: "Marc D'Almeida",
    phone: "+237 6 70 11 22 33",
    whatsapp: "+237 6 70 11 22 33",
    creationId: "crea-01",
    creationTitle: "Costume Croisé Rose Poudré & Boutons d'Or",
    status: "Confirmé",
    notes: "Acompte versé, essayage prévu le 22 septembre.",
    description: "Commande confirmée pour remise de prix.",
    createdAt: "2026-09-10T11:00:00Z",
  },
];

// Gestionnaire de persistance en mémoire / local avec connecteur Supabase bidirectionnel
class DatabaseService {
  private creations: Creation[] = [...INITIAL_CREATIONS];
  private collections: Collection[] = [...INITIAL_COLLECTIONS];
  private demands: Demand[] = [...INITIAL_DEMANDS];
  private settings: SiteSettings = { ...INITIAL_SETTINGS };
  private events: AnalyticsEvent[] = [];

  // ==================== CREATIONS ====================
  async getCreations(): Promise<Creation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('creations').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            ref: c.ref,
            collectionId: c.collection_id || c.collectionId || '',
            category: c.category,
            gender: c.gender,
            description: c.description || '',
            fabric: c.fabric || '',
            colors: Array.isArray(c.colors) ? c.colors : [],
            status: c.status,
            images: Array.isArray(c.images) ? c.images : [],
            featured: Boolean(c.featured),
            viewsCount: c.views_count ?? c.viewsCount ?? 0,
            whatsappClicksCount: c.whatsapp_clicks_count ?? c.whatsappClicksCount ?? 0,
            createdAt: c.created_at || c.createdAt || new Date().toISOString(),
          })) as Creation[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, fallback to local', e);
      }
    }
    return this.creations;
  }

  async getCreationBySlug(slug: string): Promise<Creation | null> {
    const list = await this.getCreations();
    return list.find(c => c.slug === slug) || null;
  }

  async addCreation(creation: Omit<Creation, 'id' | 'viewsCount' | 'whatsappClicksCount' | 'createdAt'>): Promise<Creation> {
    const newCreation: Creation = {
      ...creation,
      id: `crea-${Date.now()}`,
      viewsCount: 0,
      whatsappClicksCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        await client.from('creations').insert([{
          id: newCreation.id,
          title: newCreation.title,
          slug: newCreation.slug,
          ref: newCreation.ref,
          collection_id: newCreation.collectionId,
          category: newCreation.category,
          gender: newCreation.gender,
          description: newCreation.description,
          fabric: newCreation.fabric,
          colors: newCreation.colors,
          status: newCreation.status,
          images: newCreation.images,
          featured: newCreation.featured,
          views_count: 0,
          whatsapp_clicks_count: 0,
          created_at: newCreation.createdAt,
        }]);
      } catch (e) {
        console.warn('Supabase insert failed', e);
      }
    }

    this.creations.unshift(newCreation);
    return newCreation;
  }

  async updateCreation(id: string, updates: Partial<Creation>): Promise<Creation | null> {
    const index = this.creations.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updated = { ...this.creations[index], ...updates };
    this.creations[index] = updated;

    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        const mappedUpdates: any = { ...updates };
        if (updates.collectionId !== undefined) {
          mappedUpdates.collection_id = updates.collectionId;
          delete mappedUpdates.collectionId;
        }
        if (updates.viewsCount !== undefined) {
          mappedUpdates.views_count = updates.viewsCount;
          delete mappedUpdates.viewsCount;
        }
        if (updates.whatsappClicksCount !== undefined) {
          mappedUpdates.whatsapp_clicks_count = updates.whatsappClicksCount;
          delete mappedUpdates.whatsappClicksCount;
        }
        await client.from('creations').update(mappedUpdates).eq('id', id);
      } catch (e) {
        console.warn('Supabase update failed', e);
      }
    }

    return updated;
  }

  async deleteCreation(id: string): Promise<boolean> {
    const initialLen = this.creations.length;
    this.creations = this.creations.filter(c => c.id !== id);

    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        await client.from('creations').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete failed', e);
      }
    }

    return this.creations.length < initialLen;
  }

  // ==================== COLLECTIONS ====================
  async getCollections(): Promise<Collection[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('collections').select('*');
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            description: c.description || '',
            coverImage: c.cover_image || c.coverImage || '',
            season: c.season,
            featured: Boolean(c.featured),
            creationsCount: c.creations_count ?? c.creationsCount ?? 0,
          })) as Collection[];
        }
      } catch (e) {
        console.warn('Supabase collections fetch failed, fallback', e);
      }
    }
    return this.collections;
  }

  // ==================== DEMANDES / MINI CRM ====================
  async getDemands(): Promise<Demand[]> {
    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        const { data, error } = await client.from('demandes').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            type: d.type,
            fullName: d.full_name || d.fullName,
            phone: d.phone,
            whatsapp: d.whatsapp,
            email: d.email,
            creationId: d.creation_id || d.creationId,
            creationTitle: d.creation_title || d.creationTitle,
            gender: d.gender,
            outfitType: d.outfit_type || d.outfitType,
            occasion: d.occasion,
            eventDate: d.event_date || d.eventDate,
            budget: d.budget,
            measurements: d.measurements,
            description: d.description || '',
            inspirationImages: Array.isArray(d.inspiration_images) ? d.inspiration_images : (d.inspirationImages || []),
            status: d.status,
            notes: d.notes,
            createdAt: d.created_at || d.createdAt,
          })) as Demand[];
        }
      } catch (e) {
        console.warn('Supabase demands fetch failed, fallback', e);
      }
    }
    return this.demands;
  }

  async addDemand(demand: Omit<Demand, 'id' | 'createdAt' | 'status'>): Promise<Demand> {
    const newDemand: Demand = {
      ...demand,
      id: `dem-${Date.now()}`,
      status: 'Nouveau',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('demandes').insert([{
          id: newDemand.id,
          type: newDemand.type,
          full_name: newDemand.fullName,
          phone: newDemand.phone,
          whatsapp: newDemand.whatsapp,
          email: newDemand.email,
          creation_id: newDemand.creationId,
          creation_title: newDemand.creationTitle,
          gender: newDemand.gender,
          outfit_type: newDemand.outfitType,
          occasion: newDemand.occasion,
          event_date: newDemand.eventDate,
          budget: newDemand.budget,
          measurements: newDemand.measurements,
          description: newDemand.description,
          inspiration_images: newDemand.inspirationImages,
          status: newDemand.status,
          created_at: newDemand.createdAt,
        }]);
      } catch (e) {
        console.warn('Supabase demand insert failed', e);
      }
    }

    this.demands.unshift(newDemand);
    return newDemand;
  }

  async updateDemandStatus(id: string, status: Demand['status'], notes?: string): Promise<Demand | null> {
    const index = this.demands.findIndex(d => d.id === id);
    if (index === -1) return null;

    const updated = {
      ...this.demands[index],
      status,
      ...(notes ? { notes } : {}),
    };
    this.demands[index] = updated;

    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        await client.from('demandes').update({ status, ...(notes ? { notes } : {}) }).eq('id', id);
      } catch (e) {
        console.warn('Supabase demand update failed', e);
      }
    }

    return updated;
  }

  // ==================== ANALYTICS & STATS ====================
  async logEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    this.events.push(fullEvent);

    if (event.type === 'whatsapp_click' && event.creationId) {
      const creation = this.creations.find(c => c.id === event.creationId);
      if (creation) creation.whatsappClicksCount += 1;
    } else if (event.type === 'creation_view' && event.creationId) {
      const creation = this.creations.find(c => c.id === event.creationId);
      if (creation) creation.viewsCount += 1;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('analytics_events').insert([fullEvent]);
      } catch (e) {
        // silent fail for analytics
      }
    }
  }

  async getAnalyticsSummary(period: 'today' | '7d' | '30d' | '3m' | '12m' = '7d') {
    // Calcul de base basé sur les données réelles et historiques
    const creations = await this.getCreations();
    const demands = await this.getDemands();

    const totalViews = creations.reduce((acc, c) => acc + c.viewsCount, 0);
    const totalWhatsAppClicks = creations.reduce((acc, c) => acc + c.whatsappClicksCount, 0);
    const totalDemands = demands.length;
    const bespokeDemands = demands.filter(d => d.type === 'sur-mesure').length;

    // Données temporelles pour les graphiques
    const dailyVisits = [
      { day: 'Lun', visitors: 145, views: 320, whatsapp: 18 },
      { day: 'Mar', visitors: 198, views: 430, whatsapp: 24 },
      { day: 'Mer', visitors: 260, views: 580, whatsapp: 38 },
      { day: 'Jeu', visitors: 215, views: 490, whatsapp: 29 },
      { day: 'Ven', visitors: 340, views: 760, whatsapp: 47 },
      { day: 'Sam', visitors: 420, views: 910, whatsapp: 58 },
      { day: 'Dim', visitors: 380, views: 820, whatsapp: 51 },
    ];

    // Répartition des sources de trafic
    const trafficSources = [
      { name: 'Instagram', value: 45, color: '#E1306C' },
      { name: 'TikTok', value: 25, color: '#00F2FE' },
      { name: 'WhatsApp Direct', value: 15, color: '#25D366' },
      { name: 'Google SEO', value: 10, color: '#4285F4' },
      { name: 'Facebook', value: 5, color: '#1877F2' },
    ];

    // Répartition des appareils
    const devices = [
      { name: 'Mobile', percent: 82 },
      { name: 'Desktop', percent: 14 },
      { name: 'Tablette', percent: 4 },
    ];

    return {
      totalVisitors: Math.round(totalViews * 0.65),
      totalViews,
      creationsViewed: totalViews,
      totalWhatsAppClicks,
      totalDemands,
      bespokeDemands,
      conversionRate: ((totalWhatsAppClicks / (totalViews || 1)) * 100).toFixed(1),
      dailyVisits,
      trafficSources,
      devices,
      topCreations: creations.slice(0, 5),
    };
  }

  // ==================== PARAMÈTRES ====================
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*').limit(1).single();
        if (!error && data) return data.config as SiteSettings;
      } catch (e) {
        console.warn('Supabase settings fetch failed, fallback', e);
      }
    }
    return this.settings;
  }

  async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    this.settings = { ...this.settings, ...updates };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('settings').upsert([{ id: 1, config: this.settings }]);
      } catch (e) {
        console.warn('Supabase settings update failed', e);
      }
    }

    return this.settings;
  }
}

export const db = new DatabaseService();
