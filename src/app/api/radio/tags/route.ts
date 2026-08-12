import { NextResponse } from 'next/server';
import { GENRES } from '@/lib/constants';

export async function GET() {
  try {
    // Return our predefined genres list
    return NextResponse.json({
      tags: GENRES.map(tag => ({ name: tag })),
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Error al obtener la lista de géneros' },
      { status: 500 }
    );
  }
}
