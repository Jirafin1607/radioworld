import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_ARTISTS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query')?.toLowerCase() || '';

  try {
    if (!query) {
      return NextResponse.json({
        artists: SAMPLE_ARTISTS.slice(0, 6), // Return first 6 artists when no query
        total: SAMPLE_ARTISTS.length,
      });
    }

    // Filter artists by name or genre
    const filteredArtists = SAMPLE_ARTISTS.filter(
      artist =>
        artist.name.toLowerCase().includes(query) ||
        artist.genre.toLowerCase().includes(query) ||
        artist.origin.toLowerCase().includes(query)
    );

    return NextResponse.json({
      artists: filteredArtists,
      total: filteredArtists.length,
    });
  } catch (error) {
    console.error('Error searching artists:', error);
    return NextResponse.json(
      { error: 'Error al buscar artistas' },
      { status: 500 }
    );
  }
}
