'use client';

import { AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 space-y-1">
              <p className="font-medium">Disclaimer Legal:</p>
              <p>
                Voice model dalam platform ini adalah hasil AI dengan kemiripan
                sekitar 90% dari figur publik, bukan suara asli. Kami tidak
                berafiliasi dengan figur publik manapun.
              </p>
              <p>
                Untuk voice clone custom, pengguna bertanggung jawab atas data
                yang diupload.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Platform ini hanya menggunakan suara AI dengan kemiripan maksimal
            90% untuk tujuan edukasi.
          </p>
          <p className="mt-2">
            © 2025 AI EduVoice. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
