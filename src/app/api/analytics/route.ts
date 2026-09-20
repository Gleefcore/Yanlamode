import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function checkAdmin() {
  const token = cookies().get('yanlamode_admin_token');
  return Boolean(token && token.value.startsWith('authenticated_token_'));
}

export async function GET(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: 'Accès réservé à l’administration' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as 'today' | '7d' | '30d' | '3m' | '12m') || '7d';

    const summary = await db.getAnalyticsSummary(period);
    return NextResponse.json(summary);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur analytics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await db.logEvent(body);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur log event' }, { status: 500 });
  }
}
