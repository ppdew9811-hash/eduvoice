import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUserFromRequest } from '@/lib/auth';
import { mockData, type VoiceModel, type User, type Transaction } from '@/lib/db';

const VOICE_TRAINING_COST = 25;

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = mockData.users.get(user.userId) as User;
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check credits
    if (userData.credits < VOICE_TRAINING_COST) {
      return NextResponse.json(
        { error: 'Credit tidak mencukupi. Anda membutuhkan 25 credit untuk train voice model.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, audioUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nama voice model harus diisi' },
        { status: 400 }
      );
    }

    // Deduct credits
    userData.credits -= VOICE_TRAINING_COST;
    mockData.users.set(user.userId, userData);

    // Create voice model
    const modelId = uuidv4();
    const newModel: VoiceModel = {
      id: modelId,
      userId: user.userId,
      name,
      audioUrl,
      status: 'training',
      similarityScore: 0.90,
      createdAt: new Date(),
    };

    mockData.voiceModels.set(modelId, newModel);

    // Create transaction record
    const transactionId = uuidv4();
    const transaction: Transaction = {
      id: transactionId,
      userId: user.userId,
      type: 'voice_training',
      creditsChange: -VOICE_TRAINING_COST,
      paymentStatus: 'success',
      description: `Train voice model: ${name}`,
      createdAt: new Date(),
    };
    mockData.transactions.set(transactionId, transaction);

    // Simulate training process (in real app, this would be async)
    setTimeout(() => {
      const model = mockData.voiceModels.get(modelId);
      if (model) {
        model.status = 'ready';
        mockData.voiceModels.set(modelId, model);
      }
    }, 3000);

    return NextResponse.json({
      model: newModel,
      creditsRemaining: userData.credits,
    });
  } catch (error) {
    console.error('Voice training error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat melatih voice model' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userModels = Array.from(mockData.voiceModels.values()).filter(
      (m: VoiceModel) => m.userId === user.userId
    );

    return NextResponse.json({ models: userModels });
  } catch (error) {
    console.error('Error fetching custom voices:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data voice model' },
      { status: 500 }
    );
  }
}
