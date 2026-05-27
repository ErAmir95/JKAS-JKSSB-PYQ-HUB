import { Users, FileText, Download, Calendar } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface StatsSectionProps {
  stats: { total: number; jkas: number; jkssb: number; years: number };
}

export function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    {
      icon: FileText,
      value: formatNumber(stats.total || 500) + '+',
      label: 'Question Papers',
      desc: 'And growing every week',
      color: '#5a63f5',
    },
    {
      icon: Calendar,
      value: (stats.years || 15) + '+',
      label: 'Years Covered',
      desc: 'Historical papers archived',
      color: '#2dd4bf',
    },
    {
      icon: Users,
      value: '10K+',
      label: 'Monthly Students',
      desc: 'Trust JK PYQ Hub',
      color: '#f5c842',
    },
    {
      icon: Download,
      value: '50K+',
      label: 'Total Downloads',
      desc: 'Papers downloaded for free',
      color: '#4ade80',
    },
  ];

  return (
    <section className="border-y border-surface-border bg-surface-card/20">
      <div className="container-custom py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-4 group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-105"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-white">{item.value}</div>
                  <div className="font-medium text-white/70 text-sm mt-0.5">{item.label}</div>
                  <div className="text-xs text-white/30 mt-1">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
