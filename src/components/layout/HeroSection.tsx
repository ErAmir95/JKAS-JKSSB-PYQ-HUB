'use client';

import Link from 'next/link';
import { Search, ArrowRight, BookOpen, Download, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils';

interface HeroStats {
  total: number;
  jkas: number;
  jkssb: number;
  years: number;
}

export function HeroSection({ stats }: { stats: HeroStats }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-sm text-brand-300">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-medium">J&K's Premier PYQ Platform</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            <span className="gradient-text">Ace Your</span>{' '}
            <span className="gradient-text-brand">JKAS</span>
            <span className="gradient-text"> & </span>
            <span className="gradient-text-brand">JKSSB</span>
            <br />
            <span className="gradient-text">With Real PYQs</span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Free access to year-wise previous question papers for all JKAS and JKSSB exams.
            Download PDFs instantly, no sign-up needed.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Search papers... e.g. JKAS Polity 2022"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="input pl-12 pr-32 py-4 text-base rounded-2xl shadow-glow focus:shadow-glow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 btn-primary btn-sm rounded-xl"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { label: 'JKAS Prelims', href: '/jkas/prelims' },
              { label: 'JKAS Mains', href: '/jkas/mains' },
              { label: 'JKPSI', href: '/jkssb/jkpsi' },
              { label: 'Patwari', href: '/jkssb/patwari' },
              { label: 'Naib Tehsildar', href: '/jkssb/naib-tehsildar' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-white/50 hover:text-white bg-surface-card border border-surface-border hover:border-brand-500/40 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jkas" className="btn-primary btn-lg group">
              Browse JKAS Papers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/jkssb" className="btn-secondary btn-lg">
              <BookOpen className="w-4 h-4" />
              JKSSB Exams
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16">
          {[
            { label: 'Total Papers', value: formatNumber(stats.total || 500), icon: BookOpen },
            { label: 'JKAS Papers', value: formatNumber(stats.jkas || 200), icon: Star },
            { label: 'JKSSB Papers', value: formatNumber(stats.jkssb || 300), icon: Download },
            { label: 'Years Covered', value: `${stats.years || 15}+`, icon: ArrowRight },
          ].map((stat) => (
            <div key={stat.label} className="stat-card group">
              <div className="relative z-10">
                <div className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
