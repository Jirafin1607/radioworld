import { NextResponse } from 'next/server';
import { COUNTRIES } from '@/lib/constants';

export async function GET() {
  try {
    // Return our predefined country list with flags
    return NextResponse.json({
      countries: COUNTRIES.map(c => ({
        name: c.name,
        code: c.code,
        flag: c.flag,
      })),
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Error al obtener la lista de países' },
      { status: 500 }
    );
  }
}
