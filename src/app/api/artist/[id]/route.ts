import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_ARTISTS } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artist = SAMPLE_ARTISTS.find(a => a.id === id);

    if (!artist) {
      return NextResponse.json(
        { error: 'Artista no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ artist });
  } catch (error) {
    console.error('Error getting artist:', error);
    return NextResponse.json(
      { error: 'Error al obtener información del artista' },
      { status: 500 }
    );
  }
}
