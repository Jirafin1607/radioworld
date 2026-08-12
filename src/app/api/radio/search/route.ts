import { NextRequest, NextResponse } from 'next/server';

// Mock data for radio stations when API is unavailable
const MOCK_STATIONS = [
  {
    stationuuid: "mock-1",
    name: "Stereo Rey - Monterrey",
    url: "https://streaming.radiomonitor.com/stereoreymty",
    url_resolved: "https://streaming.radiomonitor.com/stereoreymty",
    homepage: "https://stereorey.com",
    favicon: "",
    tags: "Regional Mexicano, Grupero, Latino",
    country: "Mexico",
    countrycode: "MX",
    state: "Nuevo Leon",
    language: "spanish",
    codec: "MP3",
    bitrate: 128,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 15000,
    clicktrend: 500,
  },
  {
    stationuuid: "mock-2",
    name: "Stereo Rey - Aguascalientes",
    url: "https://streaming.radiomonitor.com/stereoreyags",
    url_resolved: "https://streaming.radiomonitor.com/stereoreyags",
    homepage: "https://stereorey.com/aguascalientes",
    favicon: "",
    tags: "Regional Mexicano, Grupero",
    country: "Mexico",
    countrycode: "MX",
    state: "Aguascalientes",
    language: "spanish",
    codec: "MP3",
    bitrate: 128,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 8500,
    clicktrend: 300,
  },
  {
    stationuuid: "mock-3",
    name: "Los 40 Principales México",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_MEXICO.mp3",
    url_resolved: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_MEXICO.mp3",
    homepage: "https://los40.com.mx/",
    favicon: "",
    tags: "Pop, Top 40, Hits",
    country: "Mexico",
    countrycode: "MX",
    state: "Ciudad de Mexico",
    language: "spanish",
    codec: "MP3",
    bitrate: 128,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 25000,
    clicktrend: 800,
  },
  {
    stationuuid: "mock-4",
    name: "Universal Radio 90.1 FM",
    url: "https://streaming.universalradio.mx/stream",
    url_resolved: "https://streaming.universalradio.mx/stream",
    homepage: "https://universalradio.mx",
    favicon: "",
    tags: "Pop, Rock, Hits, 80s, 90s",
    country: "Mexico",
    countrycode: "MX",
    state: "Monterrey",
    language: "spanish",
    codec: "AAC",
    bitrate: 96,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 18000,
    clicktrend: 600,
  },
  {
    stationuuid: "mock-5",
    name: "Radio Fórmula - La Mejor Música",
    url: "https://rfmhd.streamguys1.com/mexico.aac",
    url_resolved: "https://rfmhd.streamguys1.com/mexico.aac",
    homepage: "https://radioformula.com.mx",
    favicon: "",
    tags: "Pop, Rock, News, Talk",
    country: "Mexico",
    countrycode: "MX",
    state: "Ciudad de Mexico",
    language: "spanish",
    codec: "AAC",
    bitrate: 64,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 32000,
    clicktrend: 1000,
  },
  {
    stationuuid: "mock-6",
    name: "Exa FM México",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/EXA_MX.mp3",
    url_resolved: "https://playerservices.streamtheworld.com/api/livestream-redirect/EXA_MX.mp3",
    homepage: "https://exafm.com",
    favicon: "",
    tags: "Reggaeton, Latin Pop, Urbano",
    country: "Mexico",
    countrycode: "MX",
    state: "Ciudad de Mexico",
    language: "spanish",
    codec: "MP3",
    bitrate: 128,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 22000,
    clicktrend: 750,
  },
  {
    stationuuid: "mock-7",
    name: "80s Radio Station",
    url: "https://stream.181.fm/181-80s_128k.mp3",
    url_resolved: "https://stream.181.fm/181-80s_128k.mp3",
    homepage: "https://181.fm",
    favicon: "",
    tags: "80s, Oldies, Classic Hits, Pop Rock",
    country: "United States Of America",
    countrycode: "US",
    state: "",
    language: "english",
    codec: "MP3",
    bitrate: 128,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 45000,
    clicktrend: 1200,
  },
  {
    stationuuid: "mock-8",
    name: "KISS FM - Top 40 Hits",
    url: "https://stream.revma.ihrhls.com/zc185",
    url_resolved: "https://stream.revma.ihrhls.com/zc185",
    homepage: "https://kiisfm.iheart.com",
    favicon: "https://i.iheart.com/v3/re/assets.brands/2ebe753539305728784b0f3b178eae45?ops=new(),flood(%22white%22),swap(),merge(%22over%22),gravity(%22center%22),contain(167,167),quality(80),format(%22png%22)",
    tags: "pop,top 40,hits",
    country: "United States Of America",
    countrycode: "US",
    state: "Los Angeles CA",
    language: "english",
    codec: "AAC",
    bitrate: 0,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 1220,
    clicktrend: 1220,
  },
  {
    stationuuid: "mock-9",
    name: "Balada en Español Radio",
    url: "https://stream.zeno.fm/xn4vpq0a5zquv",
    url_resolved: "https://stream.zeno.fm/xn4vpq0a5zquv",
    homepage: "",
    favicon: "",
    tags: "Balada, Romantica, Español, Latino",
    country: "Spain",
    countrycode: "ES",
    state: "Madrid",
    language: "spanish",
    codec: "MP3",
    bitrate: 128,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 8500,
    clicktrend: 400,
  },
  {
    stationuuid: "mock-10",
    name: "Reggaeton Hits Radio",
    url: "https://stream.zeno.fm/q9naybx5d3zuv",
    url_resolved: "https://stream.zeno.fm/q9naybx5d3zuv",
    homepage: "",
    favicon: "",
    tags: "Reggaeton, Latin Urban, Trap Latino",
    country: "Puerto Rico",
    countrycode: "PR",
    state: "San Juan",
    language: "spanish",
    codec: "MP3",
    bitrate: 192,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: new Date().toISOString(),
    clickcount: 12500,
    clicktrend: 550,
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query')?.toLowerCase() || '';
  const country = searchParams.get('country')?.toUpperCase() || '';
  const tag = searchParams.get('tag')?.toLowerCase() || '';

  try {
    // Filter mock stations based on parameters
    let filteredStations = [...MOCK_STATIONS];

    if (query) {
      filteredStations = filteredStations.filter(station =>
        station.name.toLowerCase().includes(query) ||
        station.tags.toLowerCase().includes(query) ||
        station.country.toLowerCase().includes(query)
      );
    }

    if (country) {
      filteredStations = filteredStations.filter(station =>
        station.countrycode === country
      );
    }

    if (tag) {
      filteredStations = filteredStations.filter(station =>
        station.tags.toLowerCase().includes(tag)
      );
    }

    // If no filters and no results, return all mock stations
    if (!query && !country && !tag) {
      filteredStations = MOCK_STATIONS;
    }

    return NextResponse.json({
      result: filteredStations,
      total: filteredStations.length,
      offset: 0,
    });
  } catch (error) {
    console.error('Error searching radio stations:', error);
    return NextResponse.json(
      { error: 'Error al buscar estaciones de radio', result: [], total: 0 },
      { status: 500 }
    );
  }
}
