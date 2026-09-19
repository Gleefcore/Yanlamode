import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('yanlamode_admin_token');
    
    if (!token || !token.value.startsWith('authenticated_token_')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Try Supabase first
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.storage
        .from('creations')
        .upload(`uploads/${fileName}`, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('creations')
          .getPublicUrl(`uploads/${fileName}`);
          
        if (publicUrlData && publicUrlData.publicUrl) {
          return NextResponse.json({ url: publicUrlData.publicUrl });
        }
      } else if (error) {
        console.error('Supabase upload error:', error);
      }
    }

    // Fallback to local storage if Supabase is not configured or failed
    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/images/uploads/${fileName}`;

    return NextResponse.json({ url: relativeUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Erreur serveur lors du téléchargement' }, { status: 500 });
  }
}
