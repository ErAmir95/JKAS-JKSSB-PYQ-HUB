'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Clock, BookOpen } from 'lucide-react';
import type { QuestionPaper } from '@/types';
import { formatFileSize, formatNumber } from '@/lib/utils';
import { PaperViewerModal } from '@/components/pdf/PaperViewerModal';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export function PaperCard({ paper }: { paper: QuestionPaper }) {
  const [viewing, setViewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const supabase = createClient();

  const boardColor = paper.board === 'JKAS' ? '#5a63f5' : '#2dd4bf';
  const subjectColor = (paper.subject as { color?: string } | undefined)?.color || boardColor;

  async function handleView() {
    setViewing(true);
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
      toast.error('Download failed.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div className="card-hover p-5 group flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${subjectColor}15`, border: `1px solid ${subjectColor}25` }}
          >
            <FileText className="w-4 h-4" style={{ color: subjectColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white leading-snug truncate group-hover:text-brand-300 transition-colors">
              {paper.title}
            </h4>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className="badge text-xs"
                style={{ background: `${boardColor}15`, color: boardColor, border: `1px solid ${boardColor}25` }}
              >
                {paper.board}
              </span>
              <span className="badge-brand text-xs">{paper.year}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/25 mb-4 flex-wrap">
          {paper.total_questions && (
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{paper.total_questions}Q</span>
          )}
          {paper.duration_mins && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{paper.duration_mins}min</span>
          )}
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(paper.view_count)}</span>
        </div>

        <div className="flex gap-2 mt-auto">
          <button onClick={handleView} className="flex-1 btn btn-secondary btn-sm text-xs">
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button onClick={handleDownload} disabled={downloading} className="flex-1 btn btn-primary btn-sm text-xs">
            <Download className="w-3.5 h-3.5" />
            {downloading ? '...' : 'Download'}
          </button>
        </div>
      </div>

      {viewing && <PaperViewerModal paper={paper} onClose={() => setViewing(false)} />}
    </>
  );
}
