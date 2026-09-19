import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = await db.getCollections();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur collections' }, { status: 500 });
  }
}
