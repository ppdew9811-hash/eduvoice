-- AI EduVoice Database Schema
-- PostgreSQL

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  credits INTEGER DEFAULT 50,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voice Models table (custom trained models)
CREATE TABLE voice_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  audio_url TEXT,
  model_data JSONB, -- Store AI model data/parameters
  status VARCHAR(50) DEFAULT 'training', -- training, ready, failed
  similarity_score DECIMAL(3,2) DEFAULT 0.90,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Celebrity Voice Models (pre-made)
CREATE TABLE celebrity_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100), -- politician, influencer, comedian, etc.
  similarity_score DECIMAL(3,2) DEFAULT 0.90,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  voice_model_id UUID, -- Can be celebrity or custom
  voice_model_type VARCHAR(50), -- 'celebrity' or 'custom'
  video_url TEXT,
  duration INTEGER, -- in seconds
  status VARCHAR(50) DEFAULT 'generating', -- generating, ready, failed
  credits_used INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- top_up, premium_upgrade, video_generation, voice_training
  amount DECIMAL(10,2), -- in IDR
  credits_change INTEGER, -- positive for add, negative for use
  payment_method VARCHAR(50), -- gopay, dana, bank_transfer, etc.
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, success, failed
  payment_gateway VARCHAR(50), -- midtrans, xendit
  gateway_transaction_id VARCHAR(255),
  gateway_data JSONB, -- Store webhook data from payment gateway
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit Packages table
CREATE TABLE credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  credits INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL, -- in IDR
  is_premium BOOLEAN DEFAULT FALSE,
  premium_duration_days INTEGER, -- for premium packages
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default celebrity voices
INSERT INTO celebrity_voices (name, description, category, image_url) VALUES
  ('Gibran Rakabuming Raka', 'Politisi muda dengan suara yang tegas dan jelas', 'politician', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'),
  ('Najwa Shihab', 'Jurnalis dan presenter dengan artikulasi yang baik', 'journalist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'),
  ('Raditya Dika', 'Comedian dengan gaya bicara santai dan humoris', 'comedian', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200'),
  ('Deddy Corbuzier', 'Podcaster dengan suara yang kuat dan energik', 'influencer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200');

-- Insert default credit packages
INSERT INTO credit_packages (name, credits, price, is_premium, premium_duration_days) VALUES
  ('Paket Starter', 100, 50000, FALSE, NULL),
  ('Paket Reguler', 250, 100000, FALSE, NULL),
  ('Paket Pro', 500, 180000, FALSE, NULL),
  ('Premium 1 Bulan', 1000, 299000, TRUE, 30),
  ('Premium 3 Bulan', 3500, 799000, TRUE, 90),
  ('Premium 1 Tahun', 15000, 2499000, TRUE, 365);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_voice_models_user_id ON voice_models(user_id);
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(payment_status);
