'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string;
}

interface ExamBoardCardProps {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  color: string;
  stats: StatItem[];
  features: string[];
  badge: string;
}

export function ExamBoardCard({
  title, subtitle, description, href, color, stats, features, badge,
}: ExamBoardCardProps) {
  return (
    <Link href={href} className="card-hover p-8 group block relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl transition-opacity duration-500 group-hover:opacity-10 pointer-events-none"
        style={{ background: color }}
      />

      {/* Badge */}
      <div className="flex items-start justify-between mb-6">
        <div
          className="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider"
          style={{ background: `${color}20`, color }}
        >
          {badge}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <ArrowRight className="w-4 h-4" style={{ color }} />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <h3 className="font-display text-4xl font-bold text-white mb-1" style={{ color }}>
          {title}
        </h3>
        <p className="text-white/40 text-sm font-medium">{subtitle}</p>
      </div>

      <p className="text-white/60 text-sm leading-relaxed mb-6">{description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: `${color}08`, border: `1px solid ${color}15` }}
          >
            <div className="font-display font-bold text-xl text-white">{stat.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-2">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2.5 text-sm text-white/60">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}20` }}
            >
              <Check className="w-2.5 h-2.5" style={{ color }} />
            </div>
            {feature}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 pt-6 border-t border-surface-border flex items-center justify-between">
        <span className="text-sm text-white/40">Explore all papers</span>
        <span
          className="text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
          style={{ color }}
        >
          View Papers <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
