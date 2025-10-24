'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Mic,
  Video,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface VoiceModel {
  id: string;
  name: string;
  status: string;
  similarityScore: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: string;
  creditsChange: number;
  paymentStatus: string;
  description: string;
  createdAt: string;
  amount?: number;
  paymentMethod?: string;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch voice models
      const modelsResponse = await fetch('/api/voices/custom', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (modelsResponse.ok) {
        const data = await modelsResponse.json();
        setVoiceModels(data.models);
      }
      setLoadingModels(false);

      // Fetch transactions
      const transactionsResponse = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (transactionsResponse.ok) {
        const data = await transactionsResponse.json();
        setTransactions(data.transactions);
      }
      setLoadingTransactions(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoadingModels(false);
      setLoadingTransactions(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <Badge className="bg-[#4AE39E]/10 text-[#4AE39E] border border-[#4AE39E]/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ready
          </Badge>
        );
      case 'training':
        return (
          <Badge className="bg-[#4F9DFF]/10 text-[#4F9DFF] border border-[#4F9DFF]/20">
            <Clock className="w-3 h-3 mr-1" />
            Training
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'video_generation':
        return <Video className="w-4 h-4" />;
      case 'voice_training':
        return <Mic className="w-4 h-4" />;
      case 'top_up':
      case 'premium_upgrade':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Kelola voice models dan lihat aktivitas Anda
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 card-shadow rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Credit</span>
            <div className="w-10 h-10 rounded-lg bg-[#4F9DFF]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#4F9DFF]" />
            </div>
          </div>
          <p className="text-3xl font-bold">{user.credits}</p>
          <Link href="/credits">
            <Button variant="link" className="p-0 h-auto text-sm mt-2">
              Top up credit
            </Button>
          </Link>
        </Card>

        <Card className="p-6 card-shadow rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Voice Models</span>
            <div className="w-10 h-10 rounded-lg bg-[#9B8CFF]/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-[#9B8CFF]" />
            </div>
          </div>
          <p className="text-3xl font-bold">{voiceModels.length}</p>
          <Link href="/train-voice">
            <Button variant="link" className="p-0 h-auto text-sm mt-2">
              Train model baru
            </Button>
          </Link>
        </Card>

        <Card className="p-6 card-shadow rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Status Akun</span>
            <div className="w-10 h-10 rounded-lg bg-[#4AE39E]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#4AE39E]" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {user.isPremium ? 'Premium' : 'Free'}
          </p>
          {!user.isPremium && (
            <Link href="/credits">
              <Button variant="link" className="p-0 h-auto text-sm mt-2">
                Upgrade premium
              </Button>
            </Link>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Voice Models Custom</h2>
          <Card className="p-6 card-shadow rounded-2xl">
            {loadingModels ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : voiceModels.length === 0 ? (
              <div className="text-center py-8">
                <Mic className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Belum ada voice model custom
                </p>
                <Link href="/train-voice">
                  <Button className="gradient-primary text-white hover:opacity-90">
                    Train Voice Model
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {voiceModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Dibuat: {formatDate(model.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(model.status)}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Riwayat Transaksi</h2>
          <Card className="p-6 card-shadow rounded-2xl">
            {loadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada transaksi</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-sm font-semibold ${
                          transaction.creditsChange > 0
                            ? 'text-[#4AE39E]'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {transaction.creditsChange > 0 ? '+' : ''}
                        {transaction.creditsChange}
                      </p>
                      {transaction.amount && (
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(transaction.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
