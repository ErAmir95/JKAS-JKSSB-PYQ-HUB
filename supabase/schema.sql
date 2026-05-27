-- ============================================================
-- JK PYQ HUB — Complete Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE exam_board AS ENUM ('JKAS', 'JKSSB');

CREATE TYPE jkas_category AS ENUM ('PRELIMS', 'MAINS', 'OPTIONAL');

CREATE TYPE paper_type AS ENUM (
  'GS1', 'GS2', 'GS3', 'GS4', 'ESSAY',
  'PAPER1', 'PAPER2',
  'CSAT', 'GENERAL'
);

-- ============================================================
-- SUBJECTS TABLE
-- Master list of all subjects across all exams
-- ============================================================

CREATE TABLE subjects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  board       exam_board NOT NULL,
  category    jkas_category,              -- For JKAS only
  exam_name   TEXT,                       -- For JKSSB (e.g. 'JKPSI', 'Patwari')
  description TEXT,
  icon        TEXT,                       -- Lucide icon name
  color       TEXT DEFAULT '#5a63f5',    -- Hex color for UI
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXAMS TABLE (JKSSB specific exam names)
-- ============================================================

CREATE TABLE jkssb_exams (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  color       TEXT DEFAULT '#5a63f5',
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- OPTIONAL SUBJECTS (JKAS only)
-- ============================================================

CREATE TABLE optional_subjects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUESTION PAPERS TABLE
-- Core table storing all uploaded PYQ papers
-- ============================================================

CREATE TABLE question_papers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  board           exam_board NOT NULL,
  year            INT NOT NULL CHECK (year BETWEEN 1990 AND 2030),
  
  -- JKAS specific
  jkas_category   jkas_category,
  subject_id      UUID REFERENCES subjects(id) ON DELETE SET NULL,
  optional_id     UUID REFERENCES optional_subjects(id) ON DELETE SET NULL,
  paper_type      paper_type DEFAULT 'GENERAL',
  
  -- JKSSB specific
  jkssb_exam_id   UUID REFERENCES jkssb_exams(id) ON DELETE SET NULL,
  
  -- File storage
  file_url        TEXT NOT NULL,          -- Supabase storage URL
  file_path       TEXT NOT NULL,          -- Storage bucket path
  file_size       BIGINT,                 -- Bytes
  file_name       TEXT,
  thumbnail_url   TEXT,                   -- PDF first page preview
  
  -- Metadata
  total_questions INT,
  duration_mins   INT,
  max_marks       INT,
  tags            TEXT[] DEFAULT '{}',
  
  -- Stats
  view_count      INT DEFAULT 0,
  download_count  INT DEFAULT 0,
  
  -- Status
  is_published    BOOLEAN DEFAULT false,
  uploaded_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TAGS TABLE
-- ============================================================

CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  color      TEXT DEFAULT '#5a63f5',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAPER_TAGS (many-to-many)
-- ============================================================

CREATE TABLE paper_tags (
  paper_id UUID REFERENCES question_papers(id) ON DELETE CASCADE,
  tag_id   UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (paper_id, tag_id)
);

-- ============================================================
-- ADMIN PROFILES
-- ============================================================

CREATE TABLE admin_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  role       TEXT DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS TABLE
-- ============================================================

CREATE TABLE paper_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id   UUID REFERENCES question_papers(id) ON DELETE CASCADE,
  session_id TEXT,
  ip_hash    TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================

CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('hero_stats', '{"total_papers": 0, "total_subjects": 0, "total_years": 0}'),
  ('featured_exams', '[]'),
  ('announcement_banner', '{"text": "", "active": false}');

-- ============================================================
-- INDEXES for performance
-- ============================================================

CREATE INDEX idx_papers_board ON question_papers(board);
CREATE INDEX idx_papers_year ON question_papers(year DESC);
CREATE INDEX idx_papers_subject ON question_papers(subject_id);
CREATE INDEX idx_papers_jkssb_exam ON question_papers(jkssb_exam_id);
CREATE INDEX idx_papers_optional ON question_papers(optional_id);
CREATE INDEX idx_papers_published ON question_papers(is_published);
CREATE INDEX idx_papers_board_year ON question_papers(board, year DESC);
CREATE INDEX idx_papers_search ON question_papers USING gin(to_tsvector('english', title));

-- ============================================================
-- VIEWS for easy querying
-- ============================================================

CREATE VIEW published_papers AS
SELECT * FROM question_papers WHERE is_published = true;

CREATE VIEW paper_stats AS
SELECT
  board,
  COUNT(*) AS total_papers,
  COUNT(DISTINCT year) AS total_years,
  SUM(download_count) AS total_downloads,
  SUM(view_count) AS total_views
FROM question_papers
WHERE is_published = true
GROUP BY board;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_papers_updated_at
  BEFORE UPDATE ON question_papers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment view count
CREATE OR REPLACE FUNCTION increment_view_count(paper_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE question_papers SET view_count = view_count + 1 WHERE id = paper_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment download count
CREATE OR REPLACE FUNCTION increment_download_count(paper_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE question_papers SET download_count = download_count + 1 WHERE id = paper_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full text search function
CREATE OR REPLACE FUNCTION search_papers(search_query TEXT, board_filter exam_board DEFAULT NULL)
RETURNS TABLE(
  id UUID, title TEXT, board exam_board, year INT,
  jkas_category jkas_category, file_url TEXT,
  download_count INT, view_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qp.id, qp.title, qp.board, qp.year,
    qp.jkas_category, qp.file_url,
    qp.download_count, qp.view_count
  FROM question_papers qp
  WHERE
    qp.is_published = true
    AND (board_filter IS NULL OR qp.board = board_filter)
    AND to_tsvector('english', qp.title) @@ plainto_tsquery('english', search_query)
  ORDER BY
    ts_rank(to_tsvector('english', qp.title), plainto_tsquery('english', search_query)) DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE jkssb_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE optional_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_views ENABLE ROW LEVEL SECURITY;

-- Public read access for published papers
CREATE POLICY "Public can read published papers"
  ON question_papers FOR SELECT
  USING (is_published = true);

-- Admins can do everything on papers
CREATE POLICY "Admins can manage papers"
  ON question_papers FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- Public can read subjects
CREATE POLICY "Public can read subjects"
  ON subjects FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subjects"
  ON subjects FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- Public read JKSSB exams
CREATE POLICY "Public can read jkssb exams"
  ON jkssb_exams FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage jkssb exams"
  ON jkssb_exams FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- Public read optional subjects
CREATE POLICY "Public can read optional subjects"
  ON optional_subjects FOR SELECT USING (is_active = true);

-- Admin profiles: users can read their own
CREATE POLICY "Admins can read their profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);

-- Analytics: anyone can insert
CREATE POLICY "Anyone can track views"
  ON paper_views FOR INSERT WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET SETUP
-- Run separately in Supabase Dashboard > Storage
-- ============================================================

-- Create bucket: question-papers (public)
-- Settings: Public bucket, File size limit: 50MB
-- Allowed MIME types: application/pdf

-- Storage policies (add in Dashboard):
-- 1. Allow public read: (bucket_id = 'question-papers')
-- 2. Allow admin upload: check auth.uid() in admin_profiles

-- ============================================================
-- SEED DATA — JKAS Subjects
-- ============================================================

-- JKAS Prelims Subjects
INSERT INTO subjects (name, slug, board, category, icon, color, sort_order) VALUES
  ('Polity', 'jkas-prelims-polity', 'JKAS', 'PRELIMS', 'scale', '#5a63f5', 1),
  ('Economy', 'jkas-prelims-economy', 'JKAS', 'PRELIMS', 'trending-up', '#2dd4bf', 2),
  ('History', 'jkas-prelims-history', 'JKAS', 'PRELIMS', 'landmark', '#f5c842', 3),
  ('Geography', 'jkas-prelims-geography', 'JKAS', 'PRELIMS', 'globe', '#fb7185', 4),
  ('Environment', 'jkas-prelims-environment', 'JKAS', 'PRELIMS', 'leaf', '#4ade80', 5),
  ('Science & Technology', 'jkas-prelims-science-tech', 'JKAS', 'PRELIMS', 'flask-conical', '#a78bfa', 6),
  ('Current Affairs', 'jkas-prelims-current-affairs', 'JKAS', 'PRELIMS', 'newspaper', '#f97316', 7),
  ('CSAT', 'jkas-prelims-csat', 'JKAS', 'PRELIMS', 'brain', '#06b6d4', 8);

-- JKAS Mains Papers
INSERT INTO subjects (name, slug, board, category, icon, color, sort_order) VALUES
  ('GS Paper 1', 'jkas-mains-gs1', 'JKAS', 'MAINS', 'file-text', '#5a63f5', 1),
  ('GS Paper 2', 'jkas-mains-gs2', 'JKAS', 'MAINS', 'file-text', '#2dd4bf', 2),
  ('GS Paper 3', 'jkas-mains-gs3', 'JKAS', 'MAINS', 'file-text', '#f5c842', 3),
  ('GS Paper 4', 'jkas-mains-gs4', 'JKAS', 'MAINS', 'file-text', '#fb7185', 4),
  ('Essay', 'jkas-mains-essay', 'JKAS', 'MAINS', 'pen-line', '#4ade80', 5);

-- JKAS Optional Subjects
INSERT INTO optional_subjects (name, slug, sort_order) VALUES
  ('Public Administration', 'public-administration', 1),
  ('Political Science', 'political-science', 2),
  ('Geography', 'geography', 3),
  ('History', 'history', 4),
  ('Sociology', 'sociology', 5),
  ('Anthropology', 'anthropology', 6),
  ('Urdu', 'urdu', 7),
  ('Law', 'law', 8),
  ('Zoology', 'zoology', 9),
  ('Botany', 'botany', 10),
  ('Economics', 'economics', 11),
  ('Geology', 'geology', 12),
  ('Mathematics', 'mathematics', 13),
  ('Philosophy', 'philosophy', 14),
  ('Physics', 'physics', 15),
  ('Chemistry', 'chemistry', 16),
  ('Agriculture', 'agriculture', 17),
  ('Animal Husbandry', 'animal-husbandry', 18);

-- JKSSB Exams
INSERT INTO jkssb_exams (name, slug, color, sort_order) VALUES
  ('JKPSI', 'jkpsi', '#5a63f5', 1),
  ('Naib Tehsildar', 'naib-tehsildar', '#2dd4bf', 2),
  ('FAA', 'faa', '#f5c842', 3),
  ('Patwari', 'patwari', '#fb7185', 4),
  ('Finance SI', 'finance-si', '#4ade80', 5),
  ('JE Civil', 'je-civil', '#a78bfa', 6),
  ('AHTO', 'ahto', '#f97316', 7),
  ('MTS', 'mts', '#06b6d4', 8),
  ('VLW', 'vlw', '#e879f9', 9),
  ('Supervisor', 'supervisor', '#84cc16', 10),
  ('JKP Constable', 'jkp-constable', '#ef4444', 11),
  ('Junior Assistant', 'junior-assistant', '#8b5cf6', 12);
