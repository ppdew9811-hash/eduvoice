'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Upload, Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function TrainVoicePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [modelName, setModelName] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB for demo)
      if (file.size > 50 * 1024 * 1024) {
        setError('File terlalu besar. Maksimal 50MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('audio/')) {
        setError('File harus berformat audio');
        return;
      }
      setAudioFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelName.trim()) {
      setError('Nama model harus diisi');
      return;
    }

    if (!user || user.credits < 25) {
      setError('Credit tidak mencukupi. Anda membutuhkan 25 credit untuk train voice model.');
      return;
    }

    setError('');
    setSuccess('');
    setIsTraining(true);

    try {
      // In production, upload audio file to storage first
      // For demo, we'll use a placeholder URL
      const audioUrl = audioFile ? 'https://example.com/audio-placeholder.mp3' : undefined;

      const response = await fetch('/api/voices/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: modelName,
          audioUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();
      setSuccess('Voice model berhasil dibuat! Model sedang dilatih...');
      setModelName('');
      setAudioFile(null);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat train voice model');
    } finally {
      setIsTraining(false);
    }
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#4F9DFF] to-[#9B8CFF] bg-clip-text text-transparent">
          Train Voice Model Custom
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload rekaman suara Anda (1-5 menit) untuk membuat voice clone personal dengan kemiripan ~90%
        </p>
      </div>

      <Card className="p-6 md:p-8 card-shadow rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Voice Model
            </label>
            <Input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Contoh: Suara Saya"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Audio (Opsional untuk demo)
            </label>
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  {audioFile ? (
                    <>
                      <CheckCircle2 className="w-12 h-12 text-[#4AE39E]" />
                      <div>
                        <p className="font-medium text-foreground">{audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          Klik untuk upload audio
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Format: MP3, WAV, M4A (1-5 menit, max 50MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tips: Rekam suara Anda dengan jelas, hindari noise, dan baca berbagai kalimat untuk hasil terbaik
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[#4AE39E]/10 border border-[#4AE39E]/20 rounded-lg p-3 flex items-center gap-2 text-sm text-[#4AE39E]">
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">Biaya & Waktu</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Training membutuhkan <strong>25 credit</strong></li>
                  <li>Proses training memakan waktu sekitar 5-10 menit</li>
                  <li>Anda akan mendapat notifikasi saat model siap</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isTraining || !modelName.trim() || (user.credits < 25)}
            className="w-full gradient-primary text-white hover:opacity-90 h-12 text-lg font-medium"
          >
            {isTraining ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Train Voice Model (25 Credit)
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Sisa credit Anda: <strong className="text-foreground">{user.credits}</strong>
          </p>
        </form>
      </Card>
    </div>
  );
}
