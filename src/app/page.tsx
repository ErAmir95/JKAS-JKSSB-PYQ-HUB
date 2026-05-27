import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/layout/HeroSection';
import { ExamBoardCard } from '@/components/exam/ExamBoardCard';
import { StatsSection } from '@/components/layout/StatsSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { RecentPapers } from '@/components/exam/RecentPapers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'JK PYQ Hub — Free JKAS & JKSSB Previous Year Question Papers',
};

async function getStats() {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('question_papers')
      .select('board, year, id')
      .eq('is_published', true);

    if (!data) return { total: 0, jkas: 0, jkssb: 0, years: 0 };

    const years = new Set(data.map(p => p.year)).size;
    const jkas = data.filter(p => p.board === 'JKAS').length;
    const jkssb = data.filter(p => p.board === 'JKSSB').length;

    return { total: data.length, jkas, jkssb, years };
  } catch {
    return { total: 0, jkas: 0, jkssb: 0, years: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection stats={stats} />

        {/* Exam Boards Section */}
        <section className="section container-custom" id="exams">
          <div className="text-center mb-14">
            <div className="badge-brand mb-4 inline-flex">Choose Your Exam</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Select Your <span className="gradient-text-brand">Exam Board</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg">
              Comprehensive PYQ coverage for J&K's most competitive examinations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ExamBoardCard
              title="JKAS"
              subtitle="J&K Administrative Services"
              description="Complete coverage of Prelims, Mains & Optional subject papers for all years"
              href="/jkas"
              color="#5a63f5"
              stats={[
                { label: 'Prelims Subjects', value: '8' },
                { label: 'Mains Papers', value: '5' },
                { label: 'Optional Subjects', value: '18+' },
              ]}
              features={['Prelims PYQs', 'Mains GS Papers', 'Optional Subject Papers']}
              badge="KAS Exam"
            />
            <ExamBoardCard
              title="JKSSB"
              subtitle="J&K Services Selection Board"
              description="Year-wise question papers for all JKSSB recruitment examinations"
              href="/jkssb"
              color="#2dd4bf"
              stats={[
                { label: 'Exam Types', value: '12+' },
                { label: 'Subjects', value: '20+' },
                { label: 'Years Covered', value: '10+' },
              ]}
              features={['JKPSI Papers', 'Naib Tehsildar', 'Patwari & More']}
              badge="SSBJK"
            />
          </div>
        </section>

        <StatsSection stats={stats} />
        <RecentPapers />
        <FeaturesSection />
      </main>
      <Footer />
    </>
  );
}
