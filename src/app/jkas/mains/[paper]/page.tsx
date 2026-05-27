import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JKAS_MAINS_PAPERS } from '@/lib/constants';

interface PageProps {
  params: { paper: string };
}

export async function generateStaticParams() {
  return JKAS_MAINS_PAPERS.map((p) => ({ paper: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const paper = JKAS_MAINS_PAPERS.find((p) => p.slug === params.paper);
  if (!paper) return { title: 'Not Found' };
  return {
    title: `JKAS Mains ${paper.name} PYQs | JK PYQ Hub`,
    description: `Download JKAS Mains ${paper.name} previous year question papers. Year-wise PDFs for JKAS Mains preparation.`,
  };
}

export default async function JKASMainsPaperPage({ params }: PageProps) {
  const paper = JKAS_MAINS_PAPERS.find((p) => p.slug === params.paper);
  if (!paper) notFound();

  const supabase = createServerSupabaseClient();

  // Get the subject record for this mains paper
  const { data: subjectRecord } = await supabase
    .from('subjects')
    .select('id')
    .eq('slug', params.paper)
    .eq('exam_board', 'JKAS')
    .eq('category', 'MAINS')
    .single();

  let papers: any[] = [];
  if (subjectRecord) {
    const { data } = await supabase
      .from('published_papers')
      .select('*')
      .eq('subject_id', subjectRecord.id)
      .order('year', { ascending: false });
    papers = data ?? [];
  }

  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'JKAS', href: '/jkas' },
            { label: 'Mains', href: '/jkas/mains' },
            { label: paper.name },
          ]}
        />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">
              JKAS Mains
            </span>
            <span className="px-3 py-1 rounded-full bg-surface-2 text-text-muted text-sm">
              {papers.length} papers
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary">{paper.name}</h1>
          <p className="text-text-muted mt-2">
            Previous year question papers for JKAS Mains {paper.name}. Download PDFs year-wise.
          </p>
        </div>

        {papers.length === 0 ? (
          <div className="card-base text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No papers yet</h3>
            <p className="text-text-muted">
              JKAS Mains {paper.name} papers will be uploaded soon. Check back later.
            </p>
          </div>
        ) : (
          <PaperGrid papers={papers} years={years} groupByYear />
        )}
      </div>
    </div>
  );
}
