import type { JKASCategory } from '@/types';

// ─── JKAS Config ─────────────────────────────────────────────

export const JKAS_PRELIMS_SUBJECTS = [
  { name: 'Polity', slug: 'polity', icon: '⚖️', color: '#5a63f5', description: 'Indian Constitution, Governance & Political System' },
  { name: 'Economy', slug: 'economy', icon: '📈', color: '#2dd4bf', description: 'Indian Economy, Budget & Economic Concepts' },
  { name: 'History', slug: 'history', icon: '🏛️', color: '#f5c842', description: 'Ancient, Medieval & Modern Indian History' },
  { name: 'Geography', slug: 'geography', icon: '🌍', color: '#fb7185', description: 'Physical, Human & Indian Geography' },
  { name: 'Environment', slug: 'environment', icon: '🌿', color: '#4ade80', description: 'Ecology, Environment & Climate Change' },
  { name: 'Science & Technology', slug: 'science-tech', icon: '🔬', color: '#a78bfa', description: 'Science, Technology & Innovation' },
  { name: 'Current Affairs', slug: 'current-affairs', icon: '📰', color: '#f97316', description: 'National & International Current Events' },
  { name: 'CSAT', slug: 'csat', icon: '🧠', color: '#06b6d4', description: 'Comprehension, Logical Reasoning & Aptitude' },
] as const;

export const JKAS_MAINS_PAPERS = [
  { name: 'GS Paper 1', slug: 'gs1', type: 'GS1' as const, color: '#5a63f5', description: 'Indian Heritage, History, Geography & Society' },
  { name: 'GS Paper 2', slug: 'gs2', type: 'GS2' as const, color: '#2dd4bf', description: 'Governance, Constitution, Polity & Social Justice' },
  { name: 'GS Paper 3', slug: 'gs3', type: 'GS3' as const, color: '#f5c842', description: 'Economy, Technology, Environment & Disaster Management' },
  { name: 'GS Paper 4', slug: 'gs4', type: 'GS4' as const, color: '#fb7185', description: 'Ethics, Integrity & Aptitude' },
  { name: 'Essay', slug: 'essay', type: 'ESSAY' as const, color: '#4ade80', description: 'Essay Writing Paper' },
] as const;

export const JKAS_OPTIONAL_SUBJECTS = [
  { name: 'Public Administration', slug: 'public-administration' },
  { name: 'Political Science', slug: 'political-science' },
  { name: 'Geography', slug: 'geography' },
  { name: 'History', slug: 'history' },
  { name: 'Sociology', slug: 'sociology' },
  { name: 'Anthropology', slug: 'anthropology' },
  { name: 'Urdu', slug: 'urdu' },
  { name: 'Law', slug: 'law' },
  { name: 'Zoology', slug: 'zoology' },
  { name: 'Botany', slug: 'botany' },
  { name: 'Economics', slug: 'economics' },
  { name: 'Geology', slug: 'geology' },
  { name: 'Mathematics', slug: 'mathematics' },
  { name: 'Philosophy', slug: 'philosophy' },
  { name: 'Physics', slug: 'physics' },
  { name: 'Chemistry', slug: 'chemistry' },
  { name: 'Agriculture', slug: 'agriculture' },
  { name: 'Animal Husbandry', slug: 'animal-husbandry' },
  { name: 'Forestry', slug: 'forestry' },
  { name: 'Medical Science', slug: 'medical-science' },
  { name: 'Psychology', slug: 'psychology' },
  { name: 'Statistics', slug: 'statistics' },
] as const;

// ─── JKSSB Config ────────────────────────────────────────────

export const JKSSB_EXAMS = [
  { name: 'JKPSI', slug: 'jkpsi', color: '#5a63f5', description: 'J&K Police Sub Inspector' },
  { name: 'Naib Tehsildar', slug: 'naib-tehsildar', color: '#2dd4bf', description: 'Revenue Department' },
  { name: 'FAA', slug: 'faa', color: '#f5c842', description: 'Finance Accounts Assistant' },
  { name: 'Patwari', slug: 'patwari', color: '#fb7185', description: 'Revenue Patwari' },
  { name: 'Finance SI', slug: 'finance-si', color: '#4ade80', description: 'Finance Sub Inspector' },
  { name: 'JE Civil', slug: 'je-civil', color: '#a78bfa', description: 'Junior Engineer (Civil)' },
  { name: 'AHTO', slug: 'ahto', color: '#f97316', description: 'Animal Husbandry & Technical Officer' },
  { name: 'MTS', slug: 'mts', color: '#06b6d4', description: 'Multi Tasking Staff' },
  { name: 'VLW', slug: 'vlw', color: '#e879f9', description: 'Village Level Worker' },
  { name: 'Supervisor', slug: 'supervisor', color: '#84cc16', description: 'ICDS Supervisor' },
  { name: 'JKP Constable', slug: 'jkp-constable', color: '#ef4444', description: 'J&K Police Constable' },
  { name: 'Junior Assistant', slug: 'junior-assistant', color: '#8b5cf6', description: 'Junior Assistant (Various Depts)' },
] as const;

// ─── Year ranges ──────────────────────────────────────────────

export const AVAILABLE_YEARS = Array.from(
  { length: new Date().getFullYear() - 1999 },
  (_, i) => new Date().getFullYear() - i
);

// ─── Category Labels ─────────────────────────────────────────

export const CATEGORY_LABELS: Record<JKASCategory, string> = {
  PRELIMS: 'Prelims',
  MAINS: 'Mains',
  OPTIONAL: 'Optional',
};

export const CATEGORY_DESCRIPTIONS: Record<JKASCategory, string> = {
  PRELIMS: 'Objective type screening examination',
  MAINS: 'Descriptive main examination papers',
  OPTIONAL: 'Optional subject papers',
};
