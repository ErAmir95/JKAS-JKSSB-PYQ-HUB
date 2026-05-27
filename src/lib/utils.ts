import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function generatePaperTitle(params: {
  board: string;
  category?: string;
  subjectName?: string;
  examName?: string;
  year: number;
  paperType?: string;
}): string {
  const { board, category, subjectName, examName, year, paperType } = params;

  if (board === 'JKAS') {
    if (category === 'PRELIMS') return `JKAS Prelims ${subjectName} ${year}`;
    if (category === 'MAINS') return `JKAS Mains ${paperType} ${year}`;
    if (category === 'OPTIONAL') return `JKAS Optional ${subjectName} ${paperType} ${year}`;
  }

  if (board === 'JKSSB') {
    return `JKSSB ${examName} ${subjectName ? subjectName + ' ' : ''}${year}`;
  }

  return `${board} Paper ${year}`;
}

export function getYearLabel(year: number): string {
  return `${year}`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function getSupabaseStorageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/question-papers/${path}`;
}
