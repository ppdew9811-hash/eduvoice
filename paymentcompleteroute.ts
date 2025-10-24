import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { mockData, type Transaction, type User, type CreditPackage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID harus diisi' },
        { status: 400 }
      );
    }

    const transaction = mockData.transactions.get(transactionId) as Transaction;
    if (!transaction || transaction.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }

    if (transaction.paymentStatus === 'success') {
      return NextResponse.json(
        { error: 'Transaksi sudah selesai' },
        { status: 400 }
      );
    }

    const userData = mockData.users.get(user.userId) as User;
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update transaction status
    transaction.paymentStatus = 'success';
    mockData.transactions.set(transactionId, transaction);

    // Add credits to user
    userData.credits += transaction.creditsChange;

    // If premium upgrade, update premium status
    if (transaction.type === 'premium_upgrade') {
      userData.isPremium = true;
      // Find the package to get duration
      const pkg = Array.from(mockData.creditPackages.values()).find(
        (p: CreditPackage) => p.credits === transaction.creditsChange
      );
      if (pkg?.premiumDurationDays) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + pkg.premiumDurationDays);
        userData.premiumExpiresAt = expiresAt;
      }
    }

    mockData.users.set(user.userId, userData);

    return NextResponse.json({
      success: true,
      creditsAdded: transaction.creditsChange,
      totalCredits: userData.credits,
      isPremium: userData.isPremium,
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyelesaikan pembayaran' },
      { status: 500 }
    );
  }
}
