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

const INITIAL_COLLECTIONS: Collection[] = [];
const INITIAL_CREATIONS: Creation[] = [];
const INITIAL_DEMANDS: Demand[] = [];

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

  async addCollection(collection: Omit<Collection, 'id' | 'creationsCount'>): Promise<Collection> {
    const newCollection: Collection = {
      ...collection,
      id: `col-${Date.now()}`,
      creationsCount: 0,
    };

    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        await client.from('collections').insert([{
          id: newCollection.id,
          title: newCollection.title,
          slug: newCollection.slug,
          description: newCollection.description,
          cover_image: newCollection.coverImage,
          season: newCollection.season,
          featured: newCollection.featured,
          creations_count: 0,
        }]);
      } catch (e) {
        console.warn('Supabase collection insert failed', e);
      }
    }

    this.collections.push(newCollection);
    return newCollection;
  }

  async updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | null> {
    const index = this.collections.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updated = { ...this.collections[index], ...updates };
    this.collections[index] = updated;

    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        const mappedUpdates: any = { ...updates };
        if (updates.coverImage !== undefined) {
          mappedUpdates.cover_image = updates.coverImage;
          delete mappedUpdates.coverImage;
        }
        await client.from('collections').update(mappedUpdates).eq('id', id);
      } catch (e) {
        console.warn('Supabase collection update failed', e);
      }
    }

    return updated;
  }

  async deleteCollection(id: string): Promise<boolean> {
    const initialLen = this.collections.length;
    this.collections = this.collections.filter(c => c.id !== id);

    if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        await client.from('collections').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase collection delete failed', e);
      }
    }

    return this.collections.length < initialLen;
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
    // Calcul basé uniquement sur les vraies données de commandes et créations
    const creations = await this.getCreations();
    const demands = await this.getDemands();

    const totalViews = creations.reduce((acc, c) => acc + c.viewsCount, 0);
    const totalWhatsAppClicks = creations.reduce((acc, c) => acc + c.whatsappClicksCount, 0);
    const totalDemands = demands.length;
    const bespokeDemands = demands.filter(d => d.type === 'sur-mesure').length;
    const formationDemands = demands.filter(d => d.type === 'formation').length;

    // Répartition par Statut (pour graphique)
    const statuses: Record<string, number> = {};
    demands.forEach(d => {
      statuses[d.status] = (statuses[d.status] || 0) + 1;
    });
    const demandsByStatus = Object.entries(statuses).map(([name, value]) => ({ name, value }));

    // Évolution des commandes (basé sur createdAt)
    // Pour simplifier, on prend les dates réelles
    const dateCounts: Record<string, number> = {};
    demands.forEach(d => {
      const date = new Date(d.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    const orderEvolution = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));

    return {
      totalViews,
      totalWhatsAppClicks,
      totalDemands,
      bespokeDemands,
      formationDemands,
      conversionRate: totalViews > 0 ? ((totalWhatsAppClicks / totalViews) * 100).toFixed(1) : '0.0',
      demandsByStatus,
      orderEvolution,
      topCreations: creations.sort((a, b) => b.whatsappClicksCount - a.whatsappClicksCount).slice(0, 5),
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
