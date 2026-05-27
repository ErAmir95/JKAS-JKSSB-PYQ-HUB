import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; href: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-white/30">
      <Link href="/" className="hover:text-white/60 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          {i === items.length - 1 ? (
            <span className="text-white/60 font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-white/60 transition-colors">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
