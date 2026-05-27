import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PaperCard } from '@/components/exam/PaperCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export async function RecentPapers() {
  let papers: unknown[] = [];
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('question_papers')
      .select('*, subject:subjects(name, slug, color), jkssb_exam:jkssb_exams(name, slug, color)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6);
    papers = data || [];
  } catch {}

  if (papers.length === 0) return null;

  return (
    <section className="section container-custom">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="badge-brand mb-3 inline-flex">Latest Additions</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Recently Added Papers</h2>
        </div>
        <Link href="/search" className="btn-secondary btn-sm hidden sm:flex">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers.map((paper: unknown) => (
          <PaperCard key={(paper as { id: string }).id} paper={paper as never} />
        ))}
      </div>
    </section>
  );
}
