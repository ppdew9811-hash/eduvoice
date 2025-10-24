🎓 AI EduVoice
Platform edukasi berbasis AI di mana pengguna bisa belajar topik apa pun melalui video edukatif dengan voice model pilihan (selebriti atau custom clone ~90% mirip).

✨ Fitur Utama
🎤 Voice Model
Voice Selebriti: Pilih dari voice model figur publik Indonesia seperti:
Gibran Rakabuming Raka (Politisi)
Najwa Shihab (Jurnalis)
Raditya Dika (Comedian)
Deddy Corbuzier (Podcaster)
Custom Voice Clone: Upload rekaman suara Anda sendiri (1-5 menit) untuk membuat voice clone personal dengan kemiripan ~90%
🎥 Video Generation
Input topik pembelajaran apa saja
Pilih voice model (selebriti atau custom)
Sistem akan generate video edukasi dengan voice-over sesuai pilihan
Video bisa langsung diputar dan didownload
💳 Sistem Credit & Premium
Free Account:

50 credit gratis saat registrasi
Generate video: 10 credit
Train voice model: 25 credit
Premium Account:

1.000 credit per bulan
Prioritas pemrosesan video
Akses resolusi video tinggi
Unlimited voice models custom
Top Up Credit: Beli paket credit mulai dari Rp 50.000

💰 Pembayaran Lokal Indonesia
GoPay
DANA
BCA Virtual Account
Mandiri Virtual Account
Bank Transfer lainnya
🚀 Cara Menggunakan
1. Registrasi
Klik tombol "Daftar" di navbar
Isi nama, email, dan password
Klik "Daftar & Dapatkan 50 Credit Gratis"
Anda akan otomatis login dan mendapat 50 credit
2. Generate Video
Di homepage, ketik topik yang ingin dipelajari
Contoh: "Jelaskan bagaimana membaca laporan keuangan untuk pemula"
Pilih tipe voice (Selebriti atau Custom)
Pilih voice model dari dropdown
Klik "Generate Video (10 Credit)"
Tunggu proses generate (sekitar 5-10 detik untuk demo)
Video akan muncul dan bisa diputar/download
3. Train Voice Model Custom
Buka halaman "Train Voice" dari navbar
Masukkan nama untuk voice model Anda
Upload file audio (opsional untuk demo)
Klik "Train Voice Model (25 Credit)"
Model akan diproses (sekitar 5-10 menit)
Setelah ready, bisa digunakan untuk generate video
4. Dashboard
Lihat semua voice model custom yang sudah dibuat
Status training (Training / Ready / Failed)
Riwayat transaksi lengkap
Statistik penggunaan credit
5. Top Up Credit / Premium
Buka halaman "Credit / Premium"
Pilih paket yang diinginkan:
Paket Credit: 100-500 credit
Paket Premium: 1.000-15.000 credit + benefits
Pilih metode pembayaran
Klik "Bayar Sekarang"
Credit otomatis masuk ke akun (demo auto-complete)
🎨 Teknologi
Frontend
Framework: Next.js 15 (App Router)
UI Components: shadcn/ui + Tailwind CSS
State Management: React Context API
Authentication: JWT (localStorage)
Backend (API Routes)
Runtime: Next.js API Routes
Database: In-memory mock data (untuk demo)
Dalam production: gunakan PostgreSQL
Authentication: bcrypt + JWT
Payment: Mock integration
Dalam production: integrasi Midtrans/Xendit
Database Schema
Lihat file db/schema.sql untuk structure lengkap:

users - Data user, credit, premium status
voice_models - Custom voice models
celebrity_voices - Pre-made celebrity voices
videos - Generated videos
transactions - Payment & credit history
credit_packages - Available packages
🛠️ Development
Install Dependencies
cd ai-eduvoice

bun install
Run Development Server
bun run dev
Buka http://localhost:3000

Build for Production
bun run build

bun run start
📂 Struktur Project
ai-eduvoice/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── voices/        # Celebrity & Custom voices
│   │   │   ├── videos/        # Video generation
│   │   │   ├── credits/       # Credit packages
│   │   │   ├── payment/       # Payment processing
│   │   │   ├── transactions/  # Transaction history
│   │   │   └── user/          # User info
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── train-voice/       # Train voice page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── credits/           # Credits/Premium page
│   │   └── page.tsx           # Homepage (video generator)
│   ├── components/
│   │   ├── ui/                # shadcn components
│   │   ├── Navigation.tsx     # Top navbar
│   │   └── Footer.tsx         # Footer with disclaimer
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state management
│   └── lib/
│       ├── auth.ts            # JWT utilities
│       ├── db.ts              # Database mock & types
│       └── utils.ts           # Utilities
├── db/
│   └── schema.sql             # PostgreSQL schema
└── public/                    # Static assets
🎨 Tema Warna
Futuristic Calm (AI + Education)

Primary: #4F9DFF - Biru muda (teknologi & edukasi)
Secondary: #9B8CFF - Ungu lembut (AI futuristik)
Accent: #4AE39E - Hijau neon halus (tombol aksi)
Background: #F9FAFB - Putih bersih (modern)
Text: #111827 (utama), #6B7280 (sekunder)
📝 Catatan Penting
Demo vs Production
Demo Mode (Current):

Database menggunakan in-memory Map (data hilang saat restart)
Payment auto-complete tanpa gateway real
Video generation menggunakan sample video
Voice training instant (tanpa AI processing)
Production Mode (Rekomendasi):

Database: Implementasi PostgreSQL dengan schema dari db/schema.sql
Payment Gateway:
Integrasi Midtrans atau Xendit
Webhook untuk status update
Proper transaction verification
Voice Cloning:
API ElevenLabs atau Resemble.ai
Real audio processing & training
Video Generation:
OpenAI TTS + D-ID atau Synthesia
Proper video rendering pipeline
Storage:
AWS S3 / Google Cloud Storage untuk video & audio
CDN untuk delivery
Legal & Ethics
⚠️ Disclaimer Legal:

Voice model adalah hasil AI dengan kemiripan ~90%, bukan suara asli
Tidak berafiliasi dengan figur publik manapun
User bertanggung jawab atas data yang diupload
Hanya untuk tujuan edukasi
🔐 Security Notes
Untuk production, tambahkan:

Environment variables untuk secrets (JWT_SECRET, DB_URL, API keys)
HTTPS/SSL certificate
Rate limiting
Input validation & sanitization
CORS configuration
Session management yang aman
📞 Support
Untuk pertanyaan atau dukungan:

Email: support@aieduvoice.com
Documentation: [docs.aieduvoice.com]
📄 License
© 2025 AI EduVoice. All rights reserved.

Selamat menggunakan AI EduVoice! Belajar jadi lebih menyenangkan dengan suara favoritmu. 🎓✨
