import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

function checkAdmin() {
  const token = cookies().get('yanlamode_admin_token');
  return Boolean(token && token.value.startsWith('authenticated_token_'));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const collectionId = searchParams.get('collectionId');
    const featured = searchParams.get('featured');

    let list = await db.getCreations();

    if (category && category !== 'Toutes') {
      list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (gender && gender !== 'Tous') {
      list = list.filter(c => c.gender.toLowerCase() === gender.toLowerCase());
    }
    if (collectionId) {
      list = list.filter(c => c.collectionId === collectionId);
    }
    if (featured === 'true') {
      list = list.filter(c => c.featured);
    }

    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des créations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const created = await db.addCreation(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    const updated = await db.updateCreation(id, updates);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    const deleted = await db.deleteCreation(id);
    return NextResponse.json({ success: deleted });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
