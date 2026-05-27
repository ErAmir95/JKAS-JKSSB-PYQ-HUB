import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { JKAS_OPTIONAL_SUBJECTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'JKAS Optional Subjects PYQs | JK PYQ Hub',
  description: 'Previous year question papers for all JKAS Optional subjects. Download Paper 1 & Paper 2 PDFs year-wise.',
};

export default function JKASOptionalPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'JKAS', href: '/jkas' }, { label: 'Optional Subjects' }]} />

        <div className="mt-6 mb-10">
          <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">
            JKAS Optional
          </span>
          <h1 className="text-3xl font-display font-bold text-text-primary mt-3">Optional Subjects</h1>
          <p className="text-text-muted mt-2">
            Choose your optional subject to access Paper 1 & Paper 2 PYQs year-wise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {JKAS_OPTIONAL_SUBJECTS.map((subject) => (
            <Link
              key={subject.slug}
              href={`/jkas/optional/${subject.slug}`}
              className="card-base group hover:border-brand/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary group-hover:text-brand transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">Paper 1 &amp; Paper 2</p>
                </div>
                <svg className="w-5 h-5 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
