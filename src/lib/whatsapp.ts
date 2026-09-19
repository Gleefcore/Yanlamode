/**
 * Générateur dynamique de liens WhatsApp avec messages pré-formatés
 * selon le cahier des charges de YANLAMODE Haute Couture.
 * Précise la disponibilité, le budget et les livraisons partout au Cameroun, en Europe et au Canada.
 */

export interface WhatsAppMessageOptions {
  phone?: string;
  type: 'creation' | 'sur-mesure' | 'contact' | 'general';
  creationTitle?: string;
  creationRef?: string;
  collectionName?: string;
  availability?: string;
  fabric?: string;
  deliveryLocation?: string; // 'Partout au Cameroun' | 'Europe' | 'Canada' | string;
  budget?: string;
  customDetails?: {
    name?: string;
    occasion?: string;
    outfitType?: string;
    budget?: string;
    deliveryLocation?: string;
    measurements?: string;
    notes?: string;
  };
}

export function generateWhatsAppLink(options: WhatsAppMessageOptions): string {
  // Numéro officiel de l'atelier Yanlamode au Cameroun (+237 6 97 25 14 25)
  const defaultPhone = '237697251425';
  const phone = (options.phone || defaultPhone).replace(/\+/g, '').replace(/\s+/g, '');

  let text = '';

  switch (options.type) {
    case 'creation': {
      const destination = options.deliveryLocation
        ? options.deliveryLocation
        : 'Partout au Cameroun / Europe / Canada';
      const availabilityInfo = options.availability
        ? `\n• Statut : ${options.availability}`
        : '';
      const fabricInfo = options.fabric ? `\n• Tissu / Matière : ${options.fabric}` : '';
      const budgetInfo = options.budget
        ? `\n• Mon budget indicatif : ${options.budget}`
        : '\n• Mon budget indicatif : À convenir selon les mensurations et finitions';

      text = `Bonjour Yanlamode Haute Couture,\n\nJe souhaite commander la création : *${options.creationTitle || 'Modèle Haute Couture'}*${
        options.creationRef ? ` (Réf : ${options.creationRef})` : ''
      }.${availabilityInfo}${fabricInfo}\n• Lieu de livraison souhaité : ${destination}${budgetInfo}\n\nPouvez-vous me confirmer la disponibilité ainsi que les délais de confection et d'expédition ? Merci !`;
      break;
    }

    case 'sur-mesure': {
      const details = options.customDetails;
      const clientName = details?.name ? `je m'appelle ${details.name}. ` : '';
      const destination = details?.deliveryLocation
        ? details.deliveryLocation
        : 'Partout au Cameroun / Europe / Canada';
      const budget = details?.budget
        ? `\n• Budget indicatif : ${details.budget}`
        : '';
      const occasion = details?.occasion ? ` pour l'événement "${details.occasion}"` : '';

      text = `Bonjour Yanlamode Haute Couture,\n\n${clientName}Je souhaite passer commande pour une création sur mesure exclusive :\n• Tenue souhaitée : ${details?.outfitType || 'Tenue d’apparat'}${occasion}\n• Zone de livraison : ${destination}${budget}${
        details?.measurements ? `\n• Mensurations transmises : Oui` : ''
      }${details?.notes ? `\n• Détails du projet : ${details.notes}` : ''}\n\nJe souhaite échanger directement avec le créateur pour débuter mon projet.`;
      break;
    }

    case 'contact':
      text = `Bonjour Yanlamode Haute Couture,\n\nJe vous contacte concernant vos créations et services sur mesure. Je souhaite obtenir des informations sur vos modèles, vos délais de confection et vos livraisons (Cameroun, Europe, Canada).`;
      break;

    case 'general':
    default:
      text = `Bonjour Yanlamode Haute Couture,\n\nJe découvre vos créations haute couture sur votre site officiel. Je souhaiterais passer commande et échanger avec votre atelier (Livraison partout au Cameroun, Europe, Canada).`;
      break;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
