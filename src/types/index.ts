// ============================================================
// JK PYQ Hub — TypeScript Types
// ============================================================

export type ExamBoard = 'JKAS' | 'JKSSB';
export type JKASCategory = 'PRELIMS' | 'MAINS' | 'OPTIONAL';
export type PaperType = 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'ESSAY' | 'PAPER1' | 'PAPER2' | 'CSAT' | 'GENERAL';

export interface Subject {
  id: string;
  name: string;
  slug: string;
  board: ExamBoard;
  category: JKASCategory | null;
  exam_name: string | null;
  description: string | null;
  icon: string | null;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JKSSBExam {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface OptionalSubject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  board: ExamBoard;
  year: number;
  jkas_category: JKASCategory | null;
  subject_id: string | null;
  optional_id: string | null;
  paper_type: PaperType;
  jkssb_exam_id: string | null;
  file_url: string;
  file_path: string;
  file_size: number | null;
  file_name: string | null;
  thumbnail_url: string | null;
  total_questions: number | null;
  duration_mins: number | null;
  max_marks: number | null;
  tags: string[];
  view_count: number;
  download_count: number;
  is_published: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  subject?: Subject;
  jkssb_exam?: JKSSBExam;
  optional_subject?: OptionalSubject;
}

export interface AdminProfile {
  id: string;
  full_name: string | null;
  role: 'super_admin' | 'admin' | 'editor';
  avatar_url: string | null;
  created_at: string;
}

export interface PaperStats {
  board: ExamBoard;
  total_papers: number;
  total_years: number;
  total_downloads: number;
  total_views: number;
}

// ─── UI Types ────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface FilterState {
  board: ExamBoard | 'ALL';
  year: number | null;
  category: JKASCategory | null;
  examId: string | null;
  subjectId: string | null;
  search: string;
}

export interface UploadFormData {
  title: string;
  board: ExamBoard;
  year: number;
  jkas_category?: JKASCategory;
  subject_id?: string;
  optional_id?: string;
  paper_type?: PaperType;
  jkssb_exam_id?: string;
  total_questions?: number;
  duration_mins?: number;
  max_marks?: number;
  tags?: string[];
  file: File;
}

// ─── Supabase Database types ─────────────────────────────────

export interface Database {
  public: {
    Tables: {
      question_papers: {
        Row: QuestionPaper;
        Insert: Omit<QuestionPaper, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'download_count'>;
        Update: Partial<QuestionPaper>;
      };
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Subject>;
      };
      jkssb_exams: {
        Row: JKSSBExam;
        Insert: Omit<JKSSBExam, 'id' | 'created_at'>;
        Update: Partial<JKSSBExam>;
      };
      optional_subjects: {
        Row: OptionalSubject;
        Insert: Omit<OptionalSubject, 'id' | 'created_at'>;
        Update: Partial<OptionalSubject>;
      };
      admin_profiles: {
        Row: AdminProfile;
        Insert: Omit<AdminProfile, 'created_at'>;
        Update: Partial<AdminProfile>;
      };
    };
  };
}
