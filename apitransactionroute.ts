import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { mockData, type Transaction } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTransactions = Array.from(mockData.transactions.values())
      .filter((t: Transaction) => t.userId === user.userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ transactions: userTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil riwayat transaksi' },
      { status: 500 }
    );
  }
}
