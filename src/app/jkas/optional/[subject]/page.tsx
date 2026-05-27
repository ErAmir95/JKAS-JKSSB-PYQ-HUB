import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PaperGrid from '@/components/exam/PaperGrid';
import { JKAS_OPTIONAL_SUBJECTS } from '@/lib/constants';

interface PageProps {
  params: { subject: string };
}

export async function generateStaticParams() {
  return JKAS_OPTIONAL_SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const subject = JKAS_OPTIONAL_SUBJECTS.find((s) => s.slug === params.subject);
  if (!subject) return { title: 'Not Found' };
  return {
    title: `JKAS Optional ${subject.name} PYQs | JK PYQ Hub`,
    description: `Download JKAS Optional ${subject.name} Paper 1 & Paper 2 previous year question papers.`,
  };
}

export default async function JKASOptionalSubjectPage({ params }: PageProps) {
  const subject = JKAS_OPTIONAL_SUBJECTS.find((s) => s.slug === params.subject);
  if (!subject) notFound();

  const supabase = createServerSupabaseClient();

  // Get optional_subject record
  const { data: optRecord } = await supabase
    .from('optional_subjects')
    .select('id')
    .eq('slug', params.subject)
    .single();

  let paper1: any[] = [];
  let paper2: any[] = [];

  if (optRecord) {
    const { data } = await supabase
      .from('published_papers')
      .select('*')
      .eq('optional_subject_id', optRecord.id)
      .order('year', { ascending: false });

    const all = data ?? [];
    paper1 = all.filter((p) => p.paper_number === 1);
    paper2 = all.filter((p) => p.paper_number === 2);
  }

  const papers1Years = [...new Set(paper1.map((p) => p.year))].sort((a, b) => b - a);
  const papers2Years = [...new Set(paper2.map((p) => p.year))].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'JKAS', href: '/jkas' },
            { label: 'Optional', href: '/jkas/optional' },
            { label: subject.name },
          ]}
        />

        <div className="mt-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">
              JKAS Optional
            </span>
            <span className="px-3 py-1 rounded-full bg-surface-2 text-text-muted text-sm">
              {paper1.length + paper2.length} papers
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary">{subject.name}</h1>
          <p className="text-text-muted mt-2">
            Previous year question papers for JKAS Optional {subject.name} — Paper 1 & Paper 2.
          </p>
        </div>

        {/* Paper 1 */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary">Paper 1</h2>
            <span className="px-3 py-1 rounded-full bg-surface-2 text-text-muted text-sm">
              {paper1.length} papers
            </span>
          </div>
          {paper1.length === 0 ? (
            <div className="card-base text-center py-10">
              <p className="text-text-muted">Paper 1 PDFs coming soon.</p>
            </div>
          ) : (
            <PaperGrid papers={paper1} years={papers1Years} groupByYear />
          )}
        </section>

        {/* Paper 2 */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary">Paper 2</h2>
            <span className="px-3 py-1 rounded-full bg-surface-2 text-text-muted text-sm">
              {paper2.length} papers
            </span>
          </div>
          {paper2.length === 0 ? (
            <div className="card-base text-center py-10">
              <p className="text-text-muted">Paper 2 PDFs coming soon.</p>
            </div>
          ) : (
            <PaperGrid papers={paper2} years={papers2Years} groupByYear />
          )}
        </section>
      </div>
    </div>
  );
}
