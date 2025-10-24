'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Crown,
  Coins,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  isPremium: boolean;
  premiumDurationDays?: number;
}

export default function CreditsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/credits/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage || !selectedPayment) {
      alert('Pilih paket dan metode pembayaran');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          packageId: selectedPackage,
          paymentMethod: selectedPayment,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal membuat pembayaran');
      }

      const data = await response.json();

      // For demo, automatically complete payment
      const completeResponse = await fetch('/api/payment/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          transactionId: data.transaction.id,
        }),
      });

      if (completeResponse.ok) {
        alert('Pembayaran berhasil! Credit telah ditambahkan ke akun Anda.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading || loadingPackages) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const regularPackages = packages.filter((p) => !p.isPremium);
  const premiumPackages = packages.filter((p) => p.isPremium);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#4F9DFF] to-[#9B8CFF] bg-clip-text text-transparent">
          Top Up Credit & Premium
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Pilih paket yang sesuai dengan kebutuhan Anda
        </p>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-6 h-6 text-[#4F9DFF]" />
          <h2 className="text-2xl font-bold">Paket Credit</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {regularPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`p-6 card-shadow rounded-2xl cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'ring-2 ring-[#4F9DFF] bg-[#4F9DFF]/5'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#4F9DFF]/20 to-[#9B8CFF]/20 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-[#4F9DFF]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-[#4F9DFF]">
                    {pkg.credits}
                  </p>
                  <p className="text-sm text-muted-foreground">credit</p>
                </div>
                <p className="text-2xl font-semibold mb-4">
                  {formatCurrency(pkg.price)}
                </p>
                {selectedPackage === pkg.id && (
                  <Badge className="bg-[#4AE39E] text-white border-none">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Dipilih
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Crown className="w-6 h-6 text-[#9B8CFF]" />
          <h2 className="text-2xl font-bold">Paket Premium</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {premiumPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`p-6 card-shadow rounded-2xl cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'ring-2 ring-[#9B8CFF] bg-[#9B8CFF]/5'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="text-center">
                <Badge className="mb-4 gradient-primary text-white border-none">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#9B8CFF] to-[#4F9DFF] bg-clip-text text-transparent">
                    {pkg.credits}
                  </p>
                  <p className="text-sm text-muted-foreground">credit/bulan</p>
                </div>
                <p className="text-2xl font-semibold mb-4">
                  {formatCurrency(pkg.price)}
                </p>
                <div className="text-left text-sm text-muted-foreground space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4AE39E]" />
                    <span>Prioritas pemrosesan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4AE39E]" />
                    <span>Resolusi video tinggi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4AE39E]" />
                    <span>Unlimited voice models</span>
                  </div>
                </div>
                {selectedPackage === pkg.id && (
                  <Badge className="bg-[#4AE39E] text-white border-none">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Dipilih
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedPackage && (
        <Card className="p-8 card-shadow rounded-2xl max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-6">Metode Pembayaran</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { id: 'gopay', name: 'GoPay', icon: '🟢' },
              { id: 'dana', name: 'DANA', icon: '💙' },
              { id: 'bca', name: 'BCA Virtual Account', icon: '🏦' },
              { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏦' },
            ].map((method) => (
              <div
                key={method.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPayment === method.id
                    ? 'border-[#4F9DFF] bg-[#4F9DFF]/5'
                    : 'border-muted hover:border-[#4F9DFF]/50'
                }`}
                onClick={() => setSelectedPayment(method.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{method.name}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#4AE39E]" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handlePurchase}
            disabled={!selectedPayment || isProcessing}
            className="w-full gradient-accent text-white hover:opacity-90 h-12 text-lg font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Bayar Sekarang
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Pembayaran aman dengan enkripsi SSL
          </p>
        </Card>
      )}
    </div>
  );
}
