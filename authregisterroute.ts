import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, generateToken } from '@/lib/auth';
import { mockData, type User } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, dan nama harus diisi' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = Array.from(mockData.users.values()).find(
      (u: User) => u.email === email
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Create new user
    const userId = uuidv4();
    const passwordHash = await hashPassword(password);

    const newUser: User = {
      id: userId,
      email,
      passwordHash,
      name,
      credits: 50, // Starting credits
      isPremium: false,
      createdAt: new Date(),
    };

    mockData.users.set(userId, newUser);

    // Generate token
    const token = generateToken({ userId, email });

    // Return user data without password
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
