import { NextRequest, NextResponse } from 'next/server';

// SOLO UNA ESTACIÓN DEMO - STEREO REY MÉXICO
const DEMO_STATION = {
  stationuuid: "stereorey-national-demo",
  name: "🎵 Stereo Rey - Nacional (Demo)",
  url: "https://playerservices.streamtheworld.com/api/livestream-redirect/STEREOREY_SC",
  url_resolved: "https://playerservices.streamtheworld.com/api/livestream-redirect/STEREOREY_SC",
  homepage: "https://stereorey.com",
  favicon: "",
  tags: "Regional Mexicano, Grupero, Latino, Mexicano",
  country: "Mexico",
  countrycode: "MX",
  state: "Nacional",
  language: "spanish",
  codec: "MP3",
  bitrate: 128,
  hls: 0,
  lastcheckok: 1,
  lastchecktime: new Date().toISOString(),
  clickcount: 99999,
  clicktrend: 9999,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query')?.toLowerCase() || '';
  const country = searchParams.get('country')?.toUpperCase() || '';
  const tag = searchParams.get('tag')?.toLowerCase() || '';

  try {
    // Siempre regresar solo la estación demo (o filtrada si coincide la búsqueda)
    let result = [DEMO_STATION];

    // Solo filtrar si hay búsqueda y NO coincide
    if (query || country || tag) {
      const matchesQuery = !query || 
        DEMO_STATION.name.toLowerCase().includes(query) ||
        DEMO_STATION.tags.toLowerCase().includes(query) ||
        DEMO_STATION.country.toLowerCase().includes(query);
      
      const matchesCountry = !country || DEMO_STATION.countrycode === country;
      const matchesTag = !tag || DEMO_STATION.tags.toLowerCase().includes(tag);

      if (!matchesQuery || !matchesCountry || !matchesTag) {
        // Si no coincide, regresar vacío (el usuario puede buscar en RadioBrowser API real después)
        result = [];
      }
    }

    return NextResponse.json({
      result: result,
      total: result.length,
      offset: 0,
    });
  } catch (error) {
    console.error('Error searching radio stations:', error);
    return NextResponse.json(
      { error: 'Error al buscar estaciones', result: [DEMO_STATION], total: 1 },
      { status: 500 }
    );
  }
}
