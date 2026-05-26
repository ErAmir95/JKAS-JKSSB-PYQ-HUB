# JK PYQ Hub — Complete Setup & Deployment Guide

> JKAS & JKSSB Previous Year Question Papers Platform
> Built with Next.js 14 · Tailwind CSS · Supabase · Vercel

---

## Project Architecture

```
jkas-pyq/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout + metadata
│   │   ├── page.tsx                  # Homepage
│   │   ├── sitemap.ts                # Auto-generated sitemap
│   │   ├── robots.ts                 # SEO robots.txt
│   │   ├── jkas/
│   │   │   ├── page.tsx              # JKAS landing page
│   │   │   ├── prelims/
│   │   │   │   ├── page.tsx          # All prelims subjects
│   │   │   │   └── [subject]/page.tsx # Subject-wise PYQs
│   │   │   ├── mains/
│   │   │   │   ├── page.tsx          # All mains papers
│   │   │   │   └── [paper]/page.tsx  # Paper-wise PYQs
│   │   │   └── optional/
│   │   │       ├── page.tsx          # All optional subjects
│   │   │       └── [subject]/page.tsx# Optional PYQs
│   │   ├── jkssb/
│   │   │   ├── page.tsx              # All JKSSB exams
│   │   │   └── [exam]/page.tsx       # Exam-wise PYQs
│   │   ├── search/page.tsx           # Search with filters
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin auth wrapper
│   │   │   ├── login/page.tsx        # Admin login
│   │   │   ├── dashboard/page.tsx    # Stats dashboard
│   │   │   └── upload/page.tsx       # Upload new papers
│   │   └── api/
│   │       └── admin/papers/route.ts # Admin API routes
│   ├── components/
│   │   ├── layout/                   # Navbar, Footer, Hero, Stats
│   │   ├── exam/                     # PaperGrid, PaperCard, ExamBoardCard
│   │   ├── pdf/                      # PaperViewerModal
│   │   ├── admin/                    # AdminSidebar
│   │   └── ui/                       # Breadcrumb, shared UI
│   ├── lib/
│   │   ├── supabase/                 # client.ts + server.ts
│   │   ├── constants.ts              # All exam/subject configs
│   │   └── utils.ts                  # Helper functions
│   ├── types/index.ts                # TypeScript types
│   └── styles/globals.css            # Tailwind + custom CSS
├── supabase/schema.sql               # Complete DB schema
├── tailwind.config.js
├── next.config.js
└── .env.local.example
```

---

## Step 1 — Clone & Install

```bash
# Create the project directory with all files from this guide
# Then install dependencies:
npm install
```

---

## Step 2 — Set Up Supabase

### 2a. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name: `jkas-pyq-hub`
3. Set a strong database password (save it!)
4. Select region closest to India (Singapore or Mumbai)
5. Wait for project to provision (~2 minutes)

### 2b. Run the Database Schema
1. In Supabase Dashboard → **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and click **Run**
4. You'll see all tables, indexes, functions, and seed data created

### 2c. Set Up Storage Bucket
1. Go to **Storage** → **New Bucket**
2. Name: `question-papers`
3. ✅ Make it **Public**
4. File size limit: `52428800` (50MB)
5. Allowed MIME types: `application/pdf`

### 2d. Add Storage Policies
In Storage → Policies → Add policy for `question-papers` bucket:

**Policy 1 — Public Read:**
```sql
-- Allow anyone to read/download PDFs
CREATE POLICY "Public read" ON storage.objects
FOR SELECT USING (bucket_id = 'question-papers');
```

**Policy 2 — Admin Upload:**
```sql
-- Only admins can upload
CREATE POLICY "Admin upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'question-papers'
  AND auth.uid() IN (SELECT id FROM public.admin_profiles)
);
```

**Policy 3 — Admin Delete:**
```sql
CREATE POLICY "Admin delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'question-papers'
  AND auth.uid() IN (SELECT id FROM public.admin_profiles)
);
```

### 2e. Create Admin User
1. Go to **Authentication** → **Users** → **Add User**
2. Email: your admin email
3. Password: strong password
4. Confirm user
5. Copy the User UUID

6. Go to **SQL Editor** and run:
```sql
INSERT INTO public.admin_profiles (id, full_name, role)
VALUES ('PASTE-USER-UUID-HERE', 'Admin Name', 'super_admin');
```

### 2f. Get API Keys
In Supabase Dashboard → **Settings** → **API**:
- Copy `Project URL`
- Copy `anon` public key
- Copy `service_role` secret key

---

## Step 3 — Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=JK PYQ Hub
```

---

## Step 4 — Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin panel:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Step 5 — Deploy to Vercel

### 5a. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: JK PYQ Hub"
git remote add origin https://github.com/YOUR_USERNAME/jkas-pyq-hub.git
git push -u origin main
```

### 5b. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Add Environment Variables (same as `.env.local` but with your production URL):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` → `https://your-app.vercel.app`
5. Click **Deploy**

### 5c. Custom Domain (Optional)
1. Vercel → Project → **Domains** → Add your domain
2. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
3. Update Supabase → **Authentication** → **URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`

---

## Step 6 — Upload Your First Paper

1. Go to `https://your-site.vercel.app/admin/login`
2. Log in with your admin credentials
3. Click **Upload Paper**
4. Select Board → Category → Subject → Year
5. Upload the PDF file
6. Click **Upload Paper**

The paper will be live instantly at the correct URL.

---

## Database Schema Overview

```
question_papers     ← Core table: all uploaded PDFs
subjects            ← JKAS subjects (Prelims/Mains)
jkssb_exams        ← JKSSB exam types
optional_subjects   ← JKAS Optional subjects
admin_profiles      ← Admin users
paper_views         ← Analytics
site_settings       ← Config key-value store
```

**Key relationships:**
- `question_papers.subject_id` → `subjects.id` (JKAS Prelims/Mains)
- `question_papers.optional_id` → `optional_subjects.id` (JKAS Optional)
- `question_papers.jkssb_exam_id` → `jkssb_exams.id` (JKSSB)

---

## Adding New Features

### Add a new JKSSB exam
```sql
INSERT INTO jkssb_exams (name, slug, color, description)
VALUES ('New Exam', 'new-exam', '#5a63f5', 'Description here');
```

Then add to `src/lib/constants.ts` in `JKSSB_EXAMS` array.

### Add a new Optional Subject
```sql
INSERT INTO optional_subjects (name, slug)
VALUES ('New Subject', 'new-subject');
```

Then add to `JKAS_OPTIONAL_SUBJECTS` in constants.

### Batch upload papers
Use the Supabase Dashboard → Storage to upload multiple PDFs,
then use the SQL editor to insert records into `question_papers` in bulk.

---

## SEO Checklist
- ✅ Dynamic `<title>` and `<meta description>` for each page
- ✅ OpenGraph tags for social sharing
- ✅ Auto-generated XML sitemap at `/sitemap.xml`
- ✅ `robots.txt` with admin exclusion
- ✅ Semantic HTML structure
- ✅ Fast loading (Next.js ISR + Vercel Edge)
- ✅ Mobile responsive design

---

## Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Custom CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Fonts | Syne (display) + DM Sans (body) |
| Icons | Lucide React |

---

## Troubleshooting

**Build fails:** Make sure all env vars are set in Vercel

**Admin login fails:** Ensure the user exists in `admin_profiles` table with correct UUID

**PDFs not loading:** Check Supabase Storage bucket is public and CORS is configured

**Search not working:** The search uses `ilike` — ensure papers are published (`is_published = true`)

**Storage 403 errors:** Re-check the storage policies in Supabase Dashboard
