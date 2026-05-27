import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JKAS_PRELIMS_SUBJECTS } from '@/lib/constants';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { FileText, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JKAS Prelims PYQ — All Subjects Previous Year Questions',
  description: 'Download JKAS Prelims previous year questions for Polity, Economy, History, Geography, Environment, Science & Technology, Current Affairs, and CSAT.',
};

async function getSubjectPaperCounts() {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('question_papers')
      .select('subject_id, year')
      .eq('board', 'JKAS')
      .eq('jkas_category', 'PRELIMS')
      .eq('is_published', true);

    const counts: Record<string, { papers: number; years: number[] }> = {};
    data?.forEach(p => {
      if (p.subject_id) {
        if (!counts[p.subject_id]) counts[p.subject_id] = { papers: 0, years: [] };
        counts[p.subject_id].papers++;
        if (!counts[p.subject_id].years.includes(p.year)) {
          counts[p.subject_id].years.push(p.year);
        }
      }
    });
    return counts;
  } catch {
    return {};
  }
}

export default async function JKASPrelimsPage() {
  const counts = await getSubjectPaperCounts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <div className="border-b border-surface-border bg-surface-card/50">
          <div className="container-custom py-8">
            <Breadcrumb items={[
              { label: 'JKAS', href: '/jkas' },
              { label: 'Prelims', href: '/jkas/prelims' },
            ]} />
            <div className="mt-4">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                JKAS Prelims PYQ
              </h1>
              <p className="text-white/50 max-w-xl">
                Objective-type screening examination. Select a subject to browse year-wise papers.
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="container-custom py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {JKAS_PRELIMS_SUBJECTS.map((subject) => {
              const info = counts[subject.slug] || { papers: 0, years: [] };
              const yearRange = info.years.length > 0
                ? `${Math.min(...info.years)}–${Math.max(...info.years)}`
                : 'Multiple years';

              return (
                <Link
                  key={subject.slug}
                  href={`/jkas/prelims/${subject.slug}`}
                  className="card-hover p-6 group block relative overflow-hidden"
                >
                  {/* Color accent */}
                  <div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                    style={{ background: subject.color }}
                  />

                  <div className="pl-3">
                    <div className="text-3xl mb-3">{subject.icon}</div>

                    <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-white/40 mb-4 leading-relaxed">
                      {subject.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-white/30">
                        <FileText className="w-3.5 h-3.5" />
                        {info.papers > 0 ? `${info.papers} papers` : 'Papers available'}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: subject.color }}>
                        <Download className="w-3 h-3" />
                        PDF
                      </div>
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
