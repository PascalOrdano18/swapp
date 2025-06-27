# Supabase Authentication Setup

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be ready

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

## 3. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Set Up Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Users profile table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  contact TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  brand TEXT,
  size TEXT,
  condition TEXT,
  ai_recommendation TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item images table
CREATE TABLE item_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Updated policies for items to allow anonymous users to see active items and users to see their own items
CREATE POLICY "Anonymous users can view active items" ON items FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view own items" ON items FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Users can insert own items" ON items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete own items" ON items FOR DELETE USING (auth.uid() = seller_id);

CREATE POLICY "Users can view item images" ON item_images FOR SELECT USING (true);
CREATE POLICY "Users can insert item images" ON item_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM items WHERE id = item_id AND seller_id = auth.uid())
);
```

## 5. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

## 6. Test the Setup

1. Run your development server: `npm run dev`
2. Navigate to `/auth` to test sign up/sign in
3. Try accessing `/upload` or `/profile` - you should be redirected to auth if not logged in

## Features Implemented

- ✅ Email/password authentication
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ Sign out functionality
- ✅ Beautiful UI matching your app's design
- ✅ Spanish language support
- ✅ Responsive design

## Next Steps

1. Add social authentication (Google, GitHub, etc.)
2. Implement user profile creation on sign up
3. Connect the upload form to save items to the database
4. Add real-time features for live updates
5. Implement image upload to Supabase Storage