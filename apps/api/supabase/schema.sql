-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  raw_text TEXT,
  parsed_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Embeddings table (for semantic search via pgvector)
CREATE TABLE IF NOT EXISTS public.embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  embedding vector(384), -- all-MiniLM-L6-v2 uses 384 dimensions
  type TEXT NOT NULL CHECK (type IN ('resume', 'job')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ATS Analyses table
CREATE TABLE IF NOT EXISTS public.ats_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  overall_score NUMERIC(5,2) NOT NULL,
  skill_match_score NUMERIC(5,2) NOT NULL,
  semantic_similarity_score NUMERIC(5,2) NOT NULL,
  experience_match_score NUMERIC(5,2) NOT NULL,
  keyword_coverage_score NUMERIC(5,2) NOT NULL,
  formatting_score NUMERIC(5,2) NOT NULL,
  education_score NUMERIC(5,2) NOT NULL,
  ai_explanation TEXT,
  tailored_bullets JSONB,
  cold_email_draft TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_embeddings_resume_id ON public.embeddings(resume_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_job_id ON public.embeddings(job_id);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_resume_id ON public.ats_analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_job_id ON public.ats_analyses(job_id);
