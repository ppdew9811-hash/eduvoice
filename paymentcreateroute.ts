import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUserFromRequest } from '@/lib/auth';
import { mockData, type Transaction, type CreditPackage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { packageId, paymentMethod } = body;

    if (!packageId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Package ID dan metode pembayaran harus diisi' },
        { status: 400 }
      );
    }

    const creditPackage = mockData.creditPackages.get(packageId) as CreditPackage;
    if (!creditPackage) {
      return NextResponse.json(
        { error: 'Paket tidak ditemukan' },
        { status: 404 }
      );
    }

    // Create transaction
    const transactionId = uuidv4();
    const transaction: Transaction = {
      id: transactionId,
      userId: user.userId,
      type: creditPackage.isPremium ? 'premium_upgrade' : 'top_up',
      amount: creditPackage.price,
      creditsChange: creditPackage.credits,
      paymentMethod,
      paymentStatus: 'pending',
      description: `Pembelian ${creditPackage.name}`,
      createdAt: new Date(),
    };

    mockData.transactions.set(transactionId, transaction);

    // In production, integrate with Midtrans/Xendit here
    // For demo, we'll return mock payment URL
    const paymentUrl = `/payment/process?id=${transactionId}`;

    return NextResponse.json({
      transaction,
      paymentUrl,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat pembayaran' },
      { status: 500 }
    );
  }
}
