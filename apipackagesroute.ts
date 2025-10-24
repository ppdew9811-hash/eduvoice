import { NextResponse } from 'next/server';
import { mockData } from '@/lib/db';

export async function GET() {
  try {
    const packages = Array.from(mockData.creditPackages.values());
    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Error fetching credit packages:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data paket credit' },
      { status: 500 }
    );
  }
}
