import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUserFromRequest } from '@/lib/auth';
import { mockData, type Video, type User, type Transaction } from '@/lib/db';

const VIDEO_GENERATION_COST = 10;

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
    if (userData.credits < VIDEO_GENERATION_COST) {
      return NextResponse.json(
        { error: 'Credit tidak mencukupi. Anda membutuhkan 10 credit untuk generate video.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { topic, voiceModelId, voiceModelType } = body;

    if (!topic || !voiceModelId || !voiceModelType) {
      return NextResponse.json(
        { error: 'Topic, voice model, dan tipe voice model harus diisi' },
        { status: 400 }
      );
    }

    // Deduct credits
    userData.credits -= VIDEO_GENERATION_COST;
    mockData.users.set(user.userId, userData);

    // Create video record
    const videoId = uuidv4();
    const newVideo: Video = {
      id: videoId,
      userId: user.userId,
      topic,
      voiceModelId,
      voiceModelType: voiceModelType as 'celebrity' | 'custom',
      status: 'generating',
      creditsUsed: VIDEO_GENERATION_COST,
      createdAt: new Date(),
    };

    mockData.videos.set(videoId, newVideo);

    // Create transaction record
    const transactionId = uuidv4();
    const transaction: Transaction = {
      id: transactionId,
      userId: user.userId,
      type: 'video_generation',
      creditsChange: -VIDEO_GENERATION_COST,
      paymentStatus: 'success',
      description: `Generate video: ${topic.substring(0, 50)}...`,
      createdAt: new Date(),
    };
    mockData.transactions.set(transactionId, transaction);

    // Simulate video generation (in real app, this would be async with AI APIs)
    setTimeout(() => {
      const video = mockData.videos.get(videoId);
      if (video) {
        video.status = 'ready';
        // Mock video URL (in production, this would be real generated video)
        video.videoUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
        video.duration = 120;
        mockData.videos.set(videoId, video);
      }
    }, 5000);

    return NextResponse.json({
      video: newVideo,
      creditsRemaining: userData.credits,
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat generate video' },
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

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

    if (videoId) {
      const video = mockData.videos.get(videoId);
      if (!video || video.userId !== user.userId) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
      return NextResponse.json({ video });
    }

    // Get all user videos
    const userVideos = Array.from(mockData.videos.values()).filter(
      (v: Video) => v.userId === user.userId
    );

    return NextResponse.json({ videos: userVideos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data video' },
      { status: 500 }
    );
  }
}
