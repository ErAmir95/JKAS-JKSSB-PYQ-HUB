'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaperGrid } from '@/components/exam/PaperGrid';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { AVAILABLE_YEARS, JKSSB_EXAMS, JKAS_PRELIMS_SUBJECTS } from '@/lib/constants';
import type { QuestionPaper } from '@/types';
import { debounce } from '@/lib/utils';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [board, setBoard] = useState<'ALL' | 'JKAS' | 'JKSSB'>('ALL');
  const [year, setYear] = useState<string>('');
  const [category, setCategory] = useState<string>('ALL');
  const [results, setResults] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const supabase = createClient();

  const performSearch = useCallback(async (q: string, boardFilter: string, yearFilter: string, catFilter: string) => {
    setLoading(true);
    setSearched(true);

    try {
      let qb = supabase
        .from('question_papers')
        .select('*, subject:subjects(name, slug, color), jkssb_exam:jkssb_exams(name, slug, color)')
        .eq('is_published', true)
        .order('year', { ascending: false })
        .limit(60);

      if (q.trim()) {
        qb = qb.ilike('title', `%${q.trim()}%`);
      }
      if (boardFilter !== 'ALL') {
        qb = qb.eq('board', boardFilter as 'JKAS' | 'JKSSB');
      }
      if (yearFilter) {
        qb = qb.eq('year', parseInt(yearFilter));
      }
      if (catFilter !== 'ALL' && boardFilter === 'JKAS') {
        qb = qb.eq('jkas_category', catFilter);
      }

      const { data, error } = await qb;
      if (!error) setResults(data || []);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((q: string) => performSearch(q, board, year, category), 400),
    [board, year, category]
  );

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery, board, year, category);
  }, []);

  useEffect(() => {
    if (searched) debouncedSearch(query);
  }, [query, board, year, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, board, year, category);
    router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
  };

  const clearFilters = () => {
    setBoard('ALL');
    setYear('');
    setCategory('ALL');
  };

  const hasFilters = board !== 'ALL' || year !== '' || category !== 'ALL';

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Search Header */}
        <div className="border-b border-surface-border bg-surface-card/50">
          <div className="container-custom py-8">
            <h1 className="font-display text-2xl font-bold text-white mb-5">Search Papers</h1>

            <form onSubmit={handleSearch}>
              <div className="relative flex items-center max-w-2xl">
                <Search className="absolute left-4 w-5 h-5 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, subject, year... e.g. JKAS Polity 2022"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="input pl-12 pr-28"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 btn-primary btn-sm">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 items-center">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>

            {/* Board filter */}
            <select
              value={board}
              onChange={e => setBoard(e.target.value as typeof board)}
              className="select w-auto text-sm py-2"
            >
              <option value="ALL">All Boards</option>
              <option value="JKAS">JKAS</option>
              <option value="JKSSB">JKSSB</option>
            </select>

            {/* Year filter */}
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="select w-auto text-sm py-2"
            >
              <option value="">All Years</option>
              {AVAILABLE_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Category filter (JKAS only) */}
            {board === 'JKAS' && (
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="select w-auto text-sm py-2"
              >
                <option value="ALL">All Categories</option>
                <option value="PRELIMS">Prelims</option>
                <option value="MAINS">Mains</option>
                <option value="OPTIONAL">Optional</option>
              </select>
            )}

            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost btn-sm text-white/40 text-xs">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-white/30">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : searched ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-white/40">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                  {query && <> for "<span className="text-white/70">{query}</span>"</>}
                </p>
              </div>
              <PaperGrid
                papers={results}
                groupByYear={false}
                emptyMessage="No papers found. Try different keywords or adjust filters."
              />
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-white/30 mb-2">Start Searching</h3>
              <p className="text-white/20 text-sm">
                Try "JKAS Polity 2022" or "JKPSI 2021"
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {['JKAS Prelims', 'JKPSI 2023', 'Geography Mains', 'Patwari 2022'].map(s => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); performSearch(s, board, year, category); setSearched(true); }}
                    className="px-3 py-1.5 text-sm text-white/40 hover:text-white bg-surface-card border border-surface-border hover:border-brand-500/40 rounded-lg transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
