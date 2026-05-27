import { Search, Download, Eye, Shield, Zap, BookOpen } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Year-wise Organization',
    description: 'Every paper organized by board, category, subject and year for quick navigation.',
    color: '#5a63f5',
  },
  {
    icon: Eye,
    title: 'Instant PDF Viewer',
    description: 'Preview papers in-browser without downloading. Zoom, scroll, and review instantly.',
    color: '#2dd4bf',
  },
  {
    icon: Download,
    title: 'Free Downloads',
    description: 'No sign-up, no paywall. Download any paper as PDF for free, anytime.',
    color: '#f5c842',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find specific papers by subject, year, or exam name in seconds.',
    color: '#fb7185',
  },
  {
    icon: Zap,
    title: 'Fast Loading',
    description: 'Optimized for speed. Papers load instantly even on slow mobile connections.',
    color: '#4ade80',
  },
  {
    icon: Shield,
    title: 'Always Free',
    description: 'JK PYQ Hub is and will always be completely free for all J&K aspirants.',
    color: '#a78bfa',
  },
];

export function FeaturesSection() {
  return (
    <section className="section container-custom">
      <div className="text-center mb-14">
        <div className="badge-brand mb-4 inline-flex">Platform Features</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Everything You Need to <span className="gradient-text-brand">Crack the Exam</span>
        </h2>
        <p className="text-white/40 max-w-lg mx-auto">
          Built specifically for JKAS and JKSSB aspirants — with all the tools needed to ace the exam
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card p-7 group hover:border-white/10 transition-all duration-300">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ background: `${feature.color}12`, border: `1px solid ${feature.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
