'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Download, Loader2, Play, AlertCircle } from 'lucide-react';

interface VoiceModel {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  similarityScore: number;
}

interface CustomVoiceModel {
  id: string;
  name: string;
  status: string;
}

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voiceType, setVoiceType] = useState<'celebrity' | 'custom'>('celebrity');
  const [celebrityVoices, setCelebrityVoices] = useState<VoiceModel[]>([]);
  const [customVoices, setCustomVoices] = useState<CustomVoiceModel[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<{
    id: string;
    videoUrl?: string;
    status: string;
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchVoices();
    }
  }, [user]);

  const fetchVoices = async () => {
    try {
      // Fetch celebrity voices
      const celebResponse = await fetch('/api/voices/celebrity');
      if (celebResponse.ok) {
        const data = await celebResponse.json();
        setCelebrityVoices(data.voices);
      }

      // Fetch custom voices
      const customResponse = await fetch('/api/voices/custom', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (customResponse.ok) {
        const data = await customResponse.json();
        setCustomVoices(data.models.filter((m: CustomVoiceModel) => m.status === 'ready'));
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !selectedVoice) {
      setError('Silakan isi topik dan pilih voice model');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedVideo(null);

    try {
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          topic,
          voiceModelId: selectedVoice,
          voiceModelType: voiceType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Poll for video completion
      const pollInterval = setInterval(async () => {
        const videoResponse = await fetch(
          `/api/videos/generate?id=${data.video.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          if (videoData.video.status === 'ready') {
            clearInterval(progressInterval);
            clearInterval(pollInterval);
            setGenerationProgress(100);
            setGeneratedVideo(videoData.video);
            setIsGenerating(false);

            // Refresh user credits
            if (user) {
              const userResponse = await fetch('/api/user/me', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              if (userResponse.ok) {
                const userData = await userResponse.json();
                // Update user in context (would need to add updateUser method)
              }
            }
          }
        }
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat generate video');
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleDownload = () => {
    if (generatedVideo?.videoUrl) {
      window.open(generatedVideo.videoUrl, '_blank');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F9DFF] via-[#9B8CFF] to-[#4AE39E] bg-clip-text text-transparent">
          AI EduVoice
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Belajar apa saja dengan suara favoritmu — atau dengan suaramu sendiri.
        </p>
      </div>

      <Card className="p-6 md:p-8 card-shadow rounded-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Apa yang ingin kamu pelajari?
            </label>
            <Textarea
              placeholder="Contoh: Jelaskan bagaimana membaca laporan keuangan untuk pemula"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Pilih Voice Model
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Select
                  value={voiceType}
                  onValueChange={(value: 'celebrity' | 'custom') =>
                    setVoiceType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celebrity">Selebriti</SelectItem>
                    <SelectItem value="custom">Voice Model Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceType === 'celebrity'
                      ? celebrityVoices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name} ({voice.category})
                          </SelectItem>
                        ))
                      : customVoices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {voiceType === 'custom' && customVoices.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Anda belum memiliki voice model custom.{' '}
                <a href="/train-voice" className="text-primary hover:underline">
                  Train voice model
                </a>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim() || !selectedVoice}
            className="w-full gradient-accent text-white hover:opacity-90 h-12 text-lg font-medium"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Video (10 Credit)
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Generating...</span>
                <span className="font-medium">{generationProgress}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div className="loading-bar absolute inset-0 h-full" />
              </div>
            </div>
          )}
        </div>
      </Card>

      {generatedVideo && (
        <Card className="mt-8 p-6 md:p-8 card-shadow rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Video Edukasi Anda</h3>
            <Badge className="bg-[#4AE39E]/10 text-[#4AE39E] border border-[#4AE39E]/20">
              Ready
            </Badge>
          </div>

          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
            <video
              src={generatedVideo.videoUrl}
              controls
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 gradient-primary text-white hover:opacity-90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
            <Button
              onClick={() => {
                setGeneratedVideo(null);
                setTopic('');
                setSelectedVoice('');
              }}
              variant="outline"
              className="flex-1"
            >
              Generate Baru
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          💡 Tips: Berikan pertanyaan yang spesifik untuk hasil terbaik. Setiap
          generate video menggunakan 10 credit.
        </p>
      </div>
    </div>
  );
}
