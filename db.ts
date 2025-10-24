import { Pool } from 'pg';

// Database connection pool
// In production, use environment variables
const pool = new Pool({
  // For demo purposes, we'll use in-memory mock data
  // In production: use actual PostgreSQL connection
  // connectionString: process.env.DATABASE_URL,
});

// Mock data for demo (since we don't have actual database)
export const mockData = {
  users: new Map(),
  voiceModels: new Map(),
  celebrityVoices: new Map([
    ['1', { id: '1', name: 'Gibran Rakabuming Raka', description: 'Politisi muda dengan suara yang tegas dan jelas', category: 'politician', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200', similarityScore: 0.90 }],
    ['2', { id: '2', name: 'Najwa Shihab', description: 'Jurnalis dan presenter dengan artikulasi yang baik', category: 'journalist', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', similarityScore: 0.90 }],
    ['3', { id: '3', name: 'Raditya Dika', description: 'Comedian dengan gaya bicara santai dan humoris', category: 'comedian', imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200', similarityScore: 0.90 }],
    ['4', { id: '4', name: 'Deddy Corbuzier', description: 'Podcaster dengan suara yang kuat dan energik', category: 'influencer', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', similarityScore: 0.90 }],
    ['5', { id: '5', name: 'Rocky Gerung', description: 'Filosof dan aktivis dengan gaya bicara kritis dan analitis', category: 'intellectual', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', similarityScore: 0.90 }],
    ['6', { id: '6', name: 'Tirta Mandira Hudhi', description: 'Dokter dan content creator dengan penjelasan yang lugas', category: 'doctor', imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200', similarityScore: 0.90 }],
  ]),
  videos: new Map(),
  transactions: new Map(),
  creditPackages: new Map([
    ['1', { id: '1', name: 'Paket Starter', credits: 100, price: 50000, isPremium: false }],
    ['2', { id: '2', name: 'Paket Reguler', credits: 250, price: 100000, isPremium: false }],
    ['3', { id: '3', name: 'Paket Pro', credits: 500, price: 180000, isPremium: false }],
    ['4', { id: '4', name: 'Premium 1 Bulan', credits: 1000, price: 299000, isPremium: true, premiumDurationDays: 30 }],
    ['5', { id: '5', name: 'Premium 3 Bulan', credits: 3500, price: 799000, isPremium: true, premiumDurationDays: 90 }],
    ['6', { id: '6', name: 'Premium 1 Tahun', credits: 15000, price: 2499000, isPremium: true, premiumDurationDays: 365 }],
  ]),
};

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  credits: number;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  createdAt: Date;
}

export interface VoiceModel {
  id: string;
  userId: string;
  name: string;
  audioUrl?: string;
  status: 'training' | 'ready' | 'failed';
  similarityScore: number;
  createdAt: Date;
}

export interface CelebrityVoice {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  similarityScore: number;
}

export interface Video {
  id: string;
  userId: string;
  topic: string;
  voiceModelId: string;
  voiceModelType: 'celebrity' | 'custom';
  videoUrl?: string;
  duration?: number;
  status: 'generating' | 'ready' | 'failed';
  creditsUsed: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount?: number;
  creditsChange: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  description: string;
  createdAt: Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  isPremium: boolean;
  premiumDurationDays?: number;
}

export default pool;
