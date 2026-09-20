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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCollection = await db.addCollection(body);
    return NextResponse.json(newCollection, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
