'use client';

import { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { QuestionPaper } from '@/types';
import { cn } from '@/lib/utils';

interface PaperViewerModalProps {
  paper: QuestionPaper;
  onClose: () => void;
}

export function PaperViewerModal({ paper, onClose }: PaperViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex flex-col w-full h-full max-w-5xl mx-auto shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-3.5 bg-surface-card border-b border-surface-border z-10 flex-shrink-0">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="font-display text-base font-semibold text-white truncate">{paper.title}</h2>
            <p className="text-xs text-white/40 mt-0.5">{paper.year} · PDF</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Zoom controls */}
            <button
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="btn-ghost btn-sm w-8 h-8 p-0 rounded-lg"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/40 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(2, s + 0.1))}
              className="btn-ghost btn-sm w-8 h-8 p-0 rounded-lg"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-surface-border mx-1" />

            <a
              href={paper.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost btn-sm w-8 h-8 p-0 rounded-lg"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={paper.file_url}
              download={paper.file_name || `${paper.title}.pdf`}
              className="btn-primary btn-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={onClose}
              className="btn-ghost btn-sm w-8 h-8 p-0 rounded-lg ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer — using iframe for broad compatibility */}
        <div className="relative flex-1 bg-surface overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-white/40">Loading PDF...</span>
              </div>
            </div>
          )}
          <iframe
            src={`${paper.file_url}#toolbar=0&navpanes=0&view=FitH`}
            className="w-full h-full border-0"
            title={paper.title}
            onLoad={() => setLoading(false)}
          />
        </div>

        {/* Footer info */}
        <div className="relative flex items-center justify-between px-5 py-2.5 bg-surface-card border-t border-surface-border text-xs text-white/30 flex-shrink-0">
          <span>{paper.title}</span>
          <span>Use Ctrl+P to print / Ctrl+S to save</span>
        </div>
      </div>
    </div>
  );
}
