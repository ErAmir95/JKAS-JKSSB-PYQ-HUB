import { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { JKAS_PRELIMS_SUBJECTS, JKAS_MAINS_PAPERS, JKAS_OPTIONAL_SUBJECTS, JKSSB_EXAMS } from '@/lib/constants';
import { slugify } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jkpyqhub.vercel.app';

  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/jkas`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/jkssb`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/jkas/prelims`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/jkas/mains`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/jkas/optional`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/search`, changeFrequency: 'daily' as const, priority: 0.7 },
  ];

  // JKAS Prelims subjects
  const prelims = JKAS_PRELIMS_SUBJECTS.map(s => ({
    url: `${baseUrl}/jkas/prelims/${s.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // JKAS Mains papers
  const mains = JKAS_MAINS_PAPERS.map(p => ({
    url: `${baseUrl}/jkas/mains/${p.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Optional subjects
  const optionals = JKAS_OPTIONAL_SUBJECTS.map(s => ({
    url: `${baseUrl}/jkas/optional/${slugify(s)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // JKSSB exams
  const jkssb = JKSSB_EXAMS.map(e => ({
    url: `${baseUrl}/jkssb/${e.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...prelims,
    ...mains,
    ...optionals,
    ...jkssb,
  ];
}
