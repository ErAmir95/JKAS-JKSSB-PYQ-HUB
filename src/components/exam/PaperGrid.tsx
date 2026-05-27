'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Calendar, Clock, BookOpen, ChevronDown } from 'lucide-react';
import type { QuestionPaper } from '@/types';
import { formatFileSize, formatNumber } from '@/lib/utils';
import { PaperViewerModal } from '@/components/pdf/PaperViewerModal';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface PaperGridProps {
  papers: QuestionPaper[];
  emptyMessage?: string;
  groupByYear?: boolean;
}

export function PaperGrid({ papers, emptyMessage, groupByYear = true }: PaperGridProps) {
  const [viewingPaper, setViewingPaper] = useState<QuestionPaper | null>(null);
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(new Set());

  if (papers.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-white/20" />
        </div>
        <h3 className="font-display text-lg font-semibold text-white/40 mb-2">No Papers Yet</h3>
        <p className="text-white/25 text-sm max-w-xs mx-auto">{emptyMessage || 'Papers will be uploaded soon.'}</p>
      </div>
    );
  }

  if (!groupByYear) {
    return (
      <>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map(paper => (
            <PaperCard key={paper.id} paper={paper} onView={() => setViewingPaper(paper)} />
          ))}
        </div>
        {viewingPaper && (
          <PaperViewerModal paper={viewingPaper} onClose={() => setViewingPaper(null)} />
        )}
      </>
    );
  }

  // Group by year
  const byYear: Record<number, QuestionPaper[]> = {};
  papers.forEach(p => {
    if (!byYear[p.year]) byYear[p.year] = [];
    byYear[p.year].push(p);
  });
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <>
      <div className="space-y-6">
        {years.map(year => {
          const isCollapsed = collapsedYears.has(year);
          const yearPapers = byYear[year];

          return (
            <div key={year} className="border border-surface-border rounded-2xl overflow-hidden">
              {/* Year Header */}
              <button
                className="w-full flex items-center justify-between px-6 py-4 bg-surface-card hover:bg-surface-hover transition-colors"
                onClick={() => {
                  setCollapsedYears(prev => {
                    const next = new Set(prev);
                    if (next.has(year)) next.delete(year);
                    else next.add(year);
                    return next;
                  });
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-brand-400" />
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-lg font-bold text-white">{year}</span>
                    <span className="text-sm text-white/30">{yearPapers.length} paper{yearPapers.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <ChevronDown className={cn('w-4 h-4 text-white/30 transition-transform duration-200', isCollapsed && '-rotate-90')} />
              </button>

              {/* Papers */}
              {!isCollapsed && (
                <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-surface/50">
                  {yearPapers.map(paper => (
                    <PaperCard key={paper.id} paper={paper} onView={() => setViewingPaper(paper)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {viewingPaper && (
        <PaperViewerModal paper={viewingPaper} onClose={() => setViewingPaper(null)} />
      )}
    </>
  );
}

// ─── Individual Paper Card ────────────────────────────────────

function PaperCard({ paper, onView }: { paper: QuestionPaper; onView: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const supabase = createClient();

  async function handleView() {
    onView();
    await supabase.rpc('increment_view_count', { paper_uuid: paper.id }).catch(() => {});
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      await supabase.rpc('increment_download_count', { paper_uuid: paper.id }).catch(() => {});
      const a = document.createElement('a');
      a.href = paper.file_url;
      a.download = paper.file_name || `${paper.title}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started!');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="group flex flex-col bg-surface-card border border-surface-border hover:border-brand-500/30 rounded-xl p-4 transition-all duration-200 hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <FileText className="w-4 h-4 text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white leading-snug truncate group-hover:text-brand-300 transition-colors">
            {paper.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="badge-brand text-xs">{paper.year}</span>
            {paper.paper_type && paper.paper_type !== 'GENERAL' && (
              <span className="badge badge-gold text-xs">{paper.paper_type}</span>
            )}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-white/30 mb-4 flex-wrap">
        {paper.total_questions && (
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{paper.total_questions} Qs</span>
        )}
        {paper.duration_mins && (
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{paper.duration_mins} min</span>
        )}
        {paper.file_size && (
          <span>{formatFileSize(paper.file_size)}</span>
        )}
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />{formatNumber(paper.view_count)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleView}
          className="flex-1 btn btn-secondary btn-sm text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 btn btn-primary btn-sm text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );
}
