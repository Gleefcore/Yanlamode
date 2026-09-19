import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yanlamode.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Création du cookie de session d'administration
      cookies().set({
        name: 'yanlamode_admin_token',
        value: 'authenticated_token_' + Buffer.from(email).toString('base64'),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        user: { email, role: 'admin' },
      });
    }

    return NextResponse.json(
      { error: 'Identifiants administrateur invalides.' },
      { status: 401 }
    );
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
  }
}

export async function GET() {
  const token = cookies().get('yanlamode_admin_token');
  if (token && token.value.startsWith('authenticated_token_')) {
    return NextResponse.json({ authenticated: true, user: { email: ADMIN_EMAIL, role: 'admin' } });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  cookies().delete('yanlamode_admin_token');
  return NextResponse.json({ success: true });
}
