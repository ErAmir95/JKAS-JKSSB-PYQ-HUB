import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JKSSB_EXAMS } from '@/lib/constants';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ArrowRight, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JKSSB PYQ — All Previous Year Question Papers',
  description: 'Download JKSSB Previous Year Question Papers for JKPSI, Naib Tehsildar, FAA, Patwari, Finance SI, JE Civil and all other exams.',
};

async function getExamStats() {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('question_papers')
      .select('jkssb_exam_id, year')
      .eq('board', 'JKSSB')
      .eq('is_published', true);

    const stats: Record<string, { count: number; years: Set<number> }> = {};
    data?.forEach(p => {
      if (p.jkssb_exam_id) {
        if (!stats[p.jkssb_exam_id]) stats[p.jkssb_exam_id] = { count: 0, years: new Set() };
        stats[p.jkssb_exam_id].count++;
        stats[p.jkssb_exam_id].years.add(p.year);
      }
    });
    return stats;
  } catch { return {}; }
}

export default async function JKSSBPage() {
  const stats = await getExamStats();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="border-b border-surface-border bg-surface-card/50">
          <div className="container-custom py-8">
            <Breadcrumb items={[{ label: 'JKSSB', href: '/jkssb' }]} />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                  JKSSB Previous Year Questions
                </h1>
                <p className="text-white/50 max-w-xl">
                  J&K Services Selection Board — all recruitment exam papers organized by exam type, subject and year
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent-teal/10 border border-accent-teal/20 rounded-xl text-accent-teal text-sm font-medium">
                <FileText className="w-4 h-4" />
                SSBJK
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {JKSSB_EXAMS.map((exam) => {
              const examStats = stats[exam.slug];
              return (
                <Link
                  key={exam.slug}
                  href={`/jkssb/${exam.slug}`}
                  className="card-hover p-6 group block relative overflow-hidden"
                >
                  {/* Color bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{ background: exam.color }}
                  />

                  <div className="pt-2">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                        {exam.name}
                      </h3>
                      <ArrowRight
                        className="w-4 h-4 text-white/20 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                        style={{ color: exam.color }}
                      />
                    </div>

                    <p className="text-xs text-white/40 mb-4">{exam.description}</p>

                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {examStats ? `${examStats.count} papers` : 'Papers available'}
                      </span>
                      {examStats && examStats.years.size > 0 && (
                        <span>
                          {Math.min(...examStats.years)}–{Math.max(...examStats.years)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
