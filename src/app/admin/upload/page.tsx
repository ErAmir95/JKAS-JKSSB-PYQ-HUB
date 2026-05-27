'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { JKAS_PRELIMS_SUBJECTS, JKAS_MAINS_PAPERS, JKSSB_EXAMS, AVAILABLE_YEARS } from '@/lib/constants';
import { generatePaperTitle, formatFileSize } from '@/lib/utils';
import type { ExamBoard, JKASCategory } from '@/types';

export default function AdminUploadPage() {
  const [board, setBoard] = useState<ExamBoard>('JKAS');
  const [category, setCategory] = useState<JKASCategory>('PRELIMS');
  const [subjectId, setSubjectId] = useState('');
  const [optionalSubjectId, setOptionalSubjectId] = useState('');
  const [paperType, setPaperType] = useState('GENERAL');
  const [jkssbExamId, setJkssbExamId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [totalQuestions, setTotalQuestions] = useState('');
  const [durationMins, setDurationMins] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Fetch DB subjects/exams
  const [dbSubjects, setDbSubjects] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [dbExams, setDbExams] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [dbOptionals, setDbOptionals] = useState<{ id: string; name: string; slug: string }[]>([]);

  useState(() => {
    supabase.from('subjects').select('id, name, slug').eq('board', 'JKAS').eq('is_active', true).then(({ data }) => setDbSubjects(data || []));
    supabase.from('jkssb_exams').select('id, name, slug').eq('is_active', true).then(({ data }) => setDbExams(data || []));
    supabase.from('optional_subjects').select('id, name, slug').eq('is_active', true).then(({ data }) => setDbOptionals(data || []));
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    if (f.size > 50 * 1024 * 1024) { toast.error('File too large (max 50MB)'); return; }
    setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  }

  async function handleUpload() {
    if (!file) { toast.error('Please select a PDF file'); return; }
    if (!year) { toast.error('Please select a year'); return; }

    setUploading(true);
    try {
      // Build title
      const subjectName = board === 'JKAS'
        ? (category === 'PRELIMS' ? dbSubjects.find(s => s.id === subjectId)?.name
          : category === 'MAINS' ? JKAS_MAINS_PAPERS.find(p => p.type === paperType)?.name
          : dbOptionals.find(o => o.id === optionalSubjectId)?.name)
        : undefined;
      const examName = board === 'JKSSB' ? dbExams.find(e => e.id === jkssbExamId)?.name : undefined;

      const title = generatePaperTitle({
        board, category: board === 'JKAS' ? category : undefined,
        subjectName, examName, year: parseInt(year),
        paperType: paperType !== 'GENERAL' ? paperType : undefined,
      });

      // Upload to Supabase Storage
      const filePath = `${board.toLowerCase()}/${year}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error: storageError } = await supabase.storage
        .from('question-papers')
        .upload(filePath, file, { contentType: 'application/pdf', upsert: false });

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('question-papers')
        .getPublicUrl(filePath);

      // Insert DB record
      const insertData: Record<string, unknown> = {
        title,
        board,
        year: parseInt(year),
        file_url: publicUrl,
        file_path: filePath,
        file_size: file.size,
        file_name: file.name,
        is_published: true,
        total_questions: totalQuestions ? parseInt(totalQuestions) : null,
        duration_mins: durationMins ? parseInt(durationMins) : null,
        max_marks: maxMarks ? parseInt(maxMarks) : null,
        paper_type: paperType,
      };

      if (board === 'JKAS') {
        insertData.jkas_category = category;
        if (category === 'PRELIMS') insertData.subject_id = subjectId || null;
        if (category === 'MAINS') insertData.subject_id = subjectId || null;
        if (category === 'OPTIONAL') insertData.optional_id = optionalSubjectId || null;
      } else {
        insertData.jkssb_exam_id = jkssbExamId || null;
      }

      const { error: dbError } = await supabase.from('question_papers').insert(insertData);
      if (dbError) throw dbError;

      setUploadSuccess(true);
      toast.success('Paper uploaded successfully!');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-white mb-2">Upload Paper</h1>
      <p className="text-white/40 text-sm mb-8">Add a new PYQ to the platform</p>

      <div className="space-y-6">
        {/* Board */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Exam Board</h2>
          <div className="grid grid-cols-2 gap-3">
            {(['JKAS', 'JKSSB'] as ExamBoard[]).map(b => (
              <button
                key={b}
                onClick={() => setBoard(b)}
                className={`py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  board === b
                    ? 'bg-brand-500/15 border-brand-500/50 text-brand-300'
                    : 'bg-surface-hover border-surface-border text-white/50 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Category/Exam */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">
            {board === 'JKAS' ? 'Category' : 'Exam Name'}
          </h2>

          {board === 'JKAS' ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(['PRELIMS', 'MAINS', 'OPTIONAL'] as JKASCategory[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      category === c
                        ? 'bg-brand-500/15 border-brand-500/50 text-brand-300'
                        : 'bg-surface-hover border-surface-border text-white/50 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Subject for Prelims/Mains */}
              {(category === 'PRELIMS' || category === 'MAINS') && (
                <select
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="select"
                >
                  <option value="">Select Subject</option>
                  {dbSubjects
                    .filter(s => {
                      if (category === 'PRELIMS') return !['gs1','gs2','gs3','gs4','essay'].some(x => s.slug.includes(x));
                      return ['gs1','gs2','gs3','gs4','essay'].some(x => s.slug.includes(x));
                    })
                    .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                  }
                </select>
              )}

              {/* Paper type for Mains */}
              {category === 'MAINS' && (
                <select value={paperType} onChange={e => setPaperType(e.target.value)} className="select mt-3">
                  <option value="GS1">GS Paper 1</option>
                  <option value="GS2">GS Paper 2</option>
                  <option value="GS3">GS Paper 3</option>
                  <option value="GS4">GS Paper 4</option>
                  <option value="ESSAY">Essay</option>
                </select>
              )}

              {/* Optional subject + paper */}
              {category === 'OPTIONAL' && (
                <div className="space-y-3">
                  <select value={optionalSubjectId} onChange={e => setOptionalSubjectId(e.target.value)} className="select">
                    <option value="">Select Optional Subject</option>
                    {dbOptionals.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select value={paperType} onChange={e => setPaperType(e.target.value)} className="select">
                    <option value="PAPER1">Paper 1</option>
                    <option value="PAPER2">Paper 2</option>
                  </select>
                </div>
              )}
            </>
          ) : (
            <select value={jkssbExamId} onChange={e => setJkssbExamId(e.target.value)} className="select">
              <option value="">Select JKSSB Exam</option>
              {dbExams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          )}
        </div>

        {/* Year & Meta */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Paper Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Year *</label>
              <select value={year} onChange={e => setYear(e.target.value)} className="select">
                {AVAILABLE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Total Questions</label>
              <input type="number" value={totalQuestions} onChange={e => setTotalQuestions(e.target.value)}
                className="input" placeholder="e.g. 100" />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Duration (mins)</label>
              <input type="number" value={durationMins} onChange={e => setDurationMins(e.target.value)}
                className="input" placeholder="e.g. 120" />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Max Marks</label>
              <input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)}
                className="input" placeholder="e.g. 200" />
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">PDF File</h2>

          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
              file
                ? 'border-brand-500/50 bg-brand-500/5'
                : 'border-surface-border hover:border-brand-500/40 hover:bg-surface-hover'
            }`}
          >
            <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />

            {file ? (
              <div>
                <FileText className="w-10 h-10 text-brand-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-white/40 mt-1">{formatFileSize(file.size)}</p>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null); }}
                  className="mt-3 text-xs text-white/30 hover:text-white/60 flex items-center gap-1 mx-auto"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-white/60">Drop PDF here or click to browse</p>
                <p className="text-xs text-white/30 mt-1">Maximum file size: 50MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`btn w-full justify-center py-4 text-base font-semibold rounded-2xl transition-all duration-200 ${
            uploadSuccess
              ? 'bg-green-500 text-white'
              : 'btn-primary'
          }`}
        >
          {uploading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
          ) : uploadSuccess ? (
            <><Check className="w-5 h-5" /> Uploaded Successfully!</>
          ) : (
            <><Upload className="w-5 h-5" /> Upload Paper</>
          )}
        </button>
      </div>
    </div>
  );
}
