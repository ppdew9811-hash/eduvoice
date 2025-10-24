import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { mockData, type User } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = mockData.users.get(user.userId) as User;
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data without password
    const { passwordHash: _, ...userWithoutPassword } = userData;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data user' },
      { status: 500 }
    );
  }
}
