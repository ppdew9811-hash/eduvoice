import { NextResponse } from 'next/server';
import { mockData } from '@/lib/db';

export async function GET() {
  try {
    const voices = Array.from(mockData.celebrityVoices.values());
    return NextResponse.json({ voices });
  } catch (error) {
    console.error('Error fetching celebrity voices:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data voice model' },
      { status: 500 }
    );
  }
}
