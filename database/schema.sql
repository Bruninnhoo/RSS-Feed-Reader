-- schema.sql
-- Run this in your Supabase SQL Editor

-- --------------------------------------------------------
-- 1. Custom Types
-- --------------------------------------------------------
CREATE TYPE feed_health_status AS ENUM ('active', 'stale', 'error');

-- --------------------------------------------------------
-- 2. Tables
-- --------------------------------------------------------

-- User Preferences (extends auth.users)
CREATE TABLE public.user_preferences (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  layout_mode TEXT DEFAULT 'list', -- 'list', 'grid', 'magazine'
  refresh_interval_min INT DEFAULT 15,
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories (user defined)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Feed Subscriptions (per user)
CREATE TABLE public.feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  site_url TEXT,
  icon_url TEXT,
  health_status feed_health_status DEFAULT 'active',
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, url)
);

-- Feed Items (articles)
-- Note: In a production app, to avoid duplication, items could be shared across users
-- who subscribe to the same feed. For this challenge, per-user fetching/storing is simpler,
-- OR we can store them globally and map read status. We will store globally.
CREATE TABLE public.feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID REFERENCES public.feeds(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(feed_id, url)
);

-- Read/Unread State
CREATE TABLE public.user_item_reads (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.feed_items(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

-- Bookmarks (Saved Items)
CREATE TABLE public.user_bookmarks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.feed_items(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

-- --------------------------------------------------------
-- 3. Row Level Security (RLS)
-- --------------------------------------------------------
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_item_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies (Users can only see/edit their own data)
CREATE POLICY "Users can manage their own preferences." 
  ON public.user_preferences FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own categories." 
  ON public.categories FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own feeds." 
  ON public.feeds FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view feed items." 
  ON public.feed_items FOR SELECT USING (
    feed_id IN (SELECT id FROM public.feeds WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert feed items."
  ON public.feed_items FOR INSERT WITH CHECK (
    feed_id IN (SELECT id FROM public.feeds WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage their read state." 
  ON public.user_item_reads FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their bookmarks." 
  ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);
