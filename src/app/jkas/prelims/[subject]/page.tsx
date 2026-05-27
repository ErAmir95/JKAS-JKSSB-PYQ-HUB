import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PaperGrid } from '@/components/exam/PaperGrid';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { JKAS_PRELIMS_SUBJECTS } from '@/lib/constants';

interface Props {
  params: { subject: string };
}

export async function generateStaticParams() {
  return JKAS_PRELIMS_SUBJECTS.map(s => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = JKAS_PRELIMS_SUBJECTS.find(s => s.slug === params.subject);
  if (!subject) return { title: 'Not Found' };
  return {
    title: `JKAS Prelims ${subject.name} PYQ — Year-wise Papers`,
    description: `Download JKAS Prelims ${subject.name} previous year question papers. All years available as PDF.`,
  };
}

async function getPapers(subjectSlug: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('question_papers')
    .select('*, subject:subjects(name, slug, color)')
    .eq('board', 'JKAS')
    .eq('jkas_category', 'PRELIMS')
    .eq('is_published', true)
    .order('year', { ascending: false });

  if (error) return [];
  return data?.filter(p => p.subject?.slug === subjectSlug) || [];
}

export default async function JKASPrelimSubjectPage({ params }: Props) {
  const subject = JKAS_PRELIMS_SUBJECTS.find(s => s.slug === params.subject);
  if (!subject) notFound();

  const papers = await getPapers(params.subject);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="border-b border-surface-border bg-surface-card/50">
          <div className="container-custom py-8">
            <Breadcrumb items={[
              { label: 'JKAS', href: '/jkas' },
              { label: 'Prelims', href: '/jkas/prelims' },
              { label: subject.name, href: `/jkas/prelims/${subject.slug}` },
            ]} />
            <div className="mt-4 flex items-center gap-4">
              <span className="text-4xl">{subject.icon}</span>
              <div>
                <h1 className="font-display text-3xl font-bold text-white">
                  JKAS Prelims — {subject.name}
                </h1>
                <p className="text-white/50 mt-1">{subject.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-10">
          <PaperGrid papers={papers} emptyMessage={`No ${subject.name} papers uploaded yet. Check back soon!`} />
        </div>
      </main>
      <Footer />
    </>
  );
}
