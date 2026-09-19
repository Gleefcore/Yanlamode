import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

function checkAdmin() {
  const token = cookies().get('yanlamode_admin_token');
  return Boolean(token && token.value.startsWith('authenticated_token_'));
}

export async function GET() {
  try {
    const settings = await db.getSettings();
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur paramètres' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: 'Accès réservé à l’administration' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = await db.updateSettings(body);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur mise à jour paramètres' }, { status: 500 });
  }
}
