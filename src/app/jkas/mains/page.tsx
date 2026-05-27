import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { JKAS_MAINS_PAPERS } from '@/lib/constants';
import { PaperGrid } from '@/components/exam/PaperGrid';
import { FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JKAS Mains PYQ — GS Papers & Essay Previous Year Questions',
  description: 'Download JKAS Mains Previous Year Papers for GS1, GS2, GS3, GS4 and Essay. All years in PDF format.',
};

async function getMainsPapers() {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('question_papers')
      .select('*, subject:subjects(name, slug, color)')
      .eq('board', 'JKAS')
      .eq('jkas_category', 'MAINS')
      .eq('is_published', true)
      .order('year', { ascending: false });
    return data || [];
  } catch { return []; }
}

export default async function JKASMainsPage() {
  const allPapers = await getMainsPapers();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="border-b border-surface-border bg-surface-card/50">
          <div className="container-custom py-8">
            <Breadcrumb items={[
              { label: 'JKAS', href: '/jkas' },
              { label: 'Mains', href: '/jkas/mains' },
            ]} />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-4 mb-2">
              JKAS Mains PYQ
            </h1>
            <p className="text-white/50">
              Descriptive examination — 4 General Studies papers and Essay
            </p>
          </div>
        </div>

        <div className="container-custom py-10">
          {/* Paper selection tabs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
            {JKAS_MAINS_PAPERS.map((paper) => {
              const count = allPapers.filter(p => p.paper_type === paper.type).length;
              return (
                <Link
                  key={paper.slug}
                  href={`/jkas/mains/${paper.slug}`}
                  className="card-hover p-5 group block text-center"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                    style={{ background: `${paper.color}15`, border: `1px solid ${paper.color}25` }}
                  >
                    <FileText className="w-4 h-4" style={{ color: paper.color }} />
                  </div>
                  <div className="font-display font-bold text-white text-sm mb-1">{paper.name}</div>
                  <div className="text-xs text-white/30">{count > 0 ? `${count} papers` : 'Available'}</div>
                  <div
                    className="flex items-center justify-center gap-1 mt-2 text-xs font-medium"
                    style={{ color: paper.color }}
                  >
                    Browse <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* All papers combined */}
          <h2 className="font-display text-xl font-bold text-white mb-6">All Mains Papers</h2>
          <PaperGrid papers={allPapers} emptyMessage="JKAS Mains papers coming soon!" />
        </div>
      </main>
      <Footer />
    </>
  );
}
