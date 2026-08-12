import { NextRequest, NextResponse } from 'next/server';

// Simple artist search - returns dynamic results based on query
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query')?.toLowerCase() || '';

  try {
    // If no query, return empty
    if (!query || query.length < 2) {
      return NextResponse.json({
        artists: [],
        total: 0,
        message: 'Ingresa al menos 2 caracteres para buscar'
      });
    }

    // Generate a dynamic artist result based on the search query
    const artist = {
      id: `artist-${Date.now()}`,
      name: query.charAt(0).toUpperCase() + query.slice(1),
      genre: 'Música',
      origin: 'Internacional',
      image: '',
      links: {
        spotify: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+official`,
        appleMusic: `https://music.apple.com/search?term=${encodeURIComponent(query)}`,
        wikipedia: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
      },
      topSongs: [],
      bio: ''
    };

    return NextResponse.json({
      artists: [artist],
      total: 1,
      source: 'Dynamic Search'
    });

  } catch (error) {
    console.error('Error searching artists:', error);
    return NextResponse.json(
      { error: 'Error al buscar artistas', artists: [] },
      { status: 500 }
    );
  }
}
