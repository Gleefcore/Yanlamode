import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { cookies } from 'next/headers';

function checkAdmin() {
  const token = cookies().get('yanlamode_admin_token');
  return Boolean(token && token.value.startsWith('authenticated_token_'));
}

export async function GET() {
  if (!checkAdmin()) {
    return NextResponse.json({ error: 'Accès réservé à l’administration' }, { status: 403 });
  }

  try {
    const list = await db.getDemands();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des demandes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await db.getSettings();

    // Enregistrement dans le CRM
    const createdDemand = await db.addDemand(body);

    // Génération du lien de redirection WhatsApp automatique
    const whatsappLink = generateWhatsAppLink({
      phone: settings.whatsappNumber,
      type: body.type || 'sur-mesure',
      creationTitle: body.creationTitle,
      customDetails: {
        name: body.fullName,
        occasion: body.occasion,
        outfitType: body.outfitType,
        budget: body.budget,
        deliveryLocation: body.deliveryLocation,
      },
    });

    return NextResponse.json({
      success: true,
      demand: createdDemand,
      whatsappLink,
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la soumission de la demande' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: 'Accès réservé à l’administration' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID et statut requis' }, { status: 400 });
    }

    const updated = await db.updateDemandStatus(id, status, notes);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la demande' }, { status: 500 });
  }
}
