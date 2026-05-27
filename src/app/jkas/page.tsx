import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JKAS_PRELIMS_SUBJECTS, JKAS_MAINS_PAPERS, JKAS_OPTIONAL_SUBJECTS } from '@/lib/constants';
import { ArrowRight, BookOpen, FileText, GraduationCap, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JKAS PYQ — Previous Year Questions | Prelims, Mains & Optional',
  description: 'Download JKAS Previous Year Question Papers for Prelims, Mains (GS1-4, Essay) and all Optional subjects. Year-wise PDF download.',
};

const CATEGORIES = [
  {
    title: 'JKAS Prelims',
    href: '/jkas/prelims',
    description: 'Objective type screening examination with 8 subjects',
    icon: BookOpen,
    color: '#5a63f5',
    count: `${JKAS_PRELIMS_SUBJECTS.length} Subjects`,
    items: JKAS_PRELIMS_SUBJECTS.slice(0, 4).map(s => s.name),
  },
  {
    title: 'JKAS Mains',
    href: '/jkas/mains',
    description: 'Descriptive main examination — 4 GS Papers + Essay',
    icon: FileText,
    color: '#2dd4bf',
    count: `${JKAS_MAINS_PAPERS.length} Papers`,
    items: JKAS_MAINS_PAPERS.map(p => p.name),
  },
  {
    title: 'JKAS Optional',
    href: '/jkas/optional',
    description: 'Optional subject papers — Paper 1 & Paper 2 year-wise',
    icon: GraduationCap,
    color: '#f5c842',
    count: `${JKAS_OPTIONAL_SUBJECTS.length}+ Subjects`,
    items: JKAS_OPTIONAL_SUBJECTS.slice(0, 4),
  },
];

export default function JKASPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <div className="border-b border-surface-border bg-surface-card/50">
          <div className="container-custom py-8">
            <Breadcrumb items={[{ label: 'JKAS', href: '/jkas' }]} />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                  JKAS Previous Year Questions
                </h1>
                <p className="text-white/50 max-w-xl">
                  J&K Administrative Services — complete PYQ collection covering Prelims, Mains, and all Optional subjects
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-300 text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                KAS Exam
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="container-custom py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.href} href={cat.href} className="card-hover p-7 group block">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}25` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{ background: `${cat.color}10`, color: cat.color }}
                    >
                      {cat.count}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold text-white mb-2">{cat.title}</h2>
                  <p className="text-white/50 text-sm mb-5 leading-relaxed">{cat.description}</p>

                  <div className="space-y-1.5 mb-5">
                    {cat.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-white/40">
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cat.color }} />
                        {item}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs text-white/25 pl-5">
                      + more subjects...
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200" style={{ color: cat.color }}>
                    Browse Papers <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick subject grid for Prelims */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              JKAS Prelims — Quick Access
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {JKAS_PRELIMS_SUBJECTS.map((subject) => (
                <Link
                  key={subject.slug}
                  href={`/jkas/prelims/${subject.slug}`}
                  className="card-hover p-4 text-center group"
                >
                  <div className="text-2xl mb-2">{subject.icon}</div>
                  <div className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">
                    {subject.name}
                  </div>
                  <div className="text-xs text-white/30 mt-1">View PYQs →</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
