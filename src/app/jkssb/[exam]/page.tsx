import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PaperGrid } from '@/components/exam/PaperGrid';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { JKSSB_EXAMS } from '@/lib/constants';

interface Props {
  params: { exam: string };
}

export async function generateStaticParams() {
  return JKSSB_EXAMS.map(e => ({ exam: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exam = JKSSB_EXAMS.find(e => e.slug === params.exam);
  if (!exam) return { title: 'Not Found' };
  return {
    title: `JKSSB ${exam.name} PYQ — Previous Year Question Papers`,
    description: `Download JKSSB ${exam.name} previous year question papers. All years in PDF format.`,
  };
}

async function getExamPapers(examSlug: string) {
  try {
    const supabase = createServerSupabaseClient();

    // First get exam id
    const { data: examData } = await supabase
      .from('jkssb_exams')
      .select('id')
      .eq('slug', examSlug)
      .single();

    if (!examData) return [];

    const { data } = await supabase
      .from('question_papers')
      .select('*, subject:subjects(name, slug, color), jkssb_exam:jkssb_exams(name, slug, color)')
      .eq('board', 'JKSSB')
      .eq('jkssb_exam_id', examData.id)
      .eq('is_published', true)
      .order('year', { ascending: false });

    return data || [];
  } catch { return []; }
}

export default async function JKSSBExamPage({ params }: Props) {
  const exam = JKSSB_EXAMS.find(e => e.slug === params.exam);
  if (!exam) notFound();

  const papers = await getExamPapers(params.exam);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="border-b border-surface-border bg-surface-card/50">
          <div className="container-custom py-8">
            <Breadcrumb items={[
              { label: 'JKSSB', href: '/jkssb' },
              { label: exam.name, href: `/jkssb/${exam.slug}` },
            ]} />

            <div className="mt-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-lg"
                style={{ background: `${exam.color}20`, border: `1px solid ${exam.color}30`, color: exam.color }}
              >
                {exam.name.slice(0, 2)}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-white">{exam.name} PYQ</h1>
                <p className="text-white/50 mt-1">{exam.description} — {papers.length} paper{papers.length !== 1 ? 's' : ''} available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-10">
          <PaperGrid
            papers={papers}
            emptyMessage={`${exam.name} papers are being added. Please check back soon!`}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
