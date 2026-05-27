'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Search, BookOpen, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    label: 'JKAS',
    href: '/jkas',
    children: [
      { label: 'Prelims', href: '/jkas/prelims', desc: '8 Subjects · Objective Type' },
      { label: 'Mains', href: '/jkas/mains', desc: '5 GS Papers + Essay' },
      { label: 'Optional Subjects', href: '/jkas/optional', desc: '18+ Optional Papers' },
    ],
  },
  {
    label: 'JKSSB',
    href: '/jkssb',
    children: [
      { label: 'JKPSI', href: '/jkssb/jkpsi', desc: 'Sub Inspector Papers' },
      { label: 'Naib Tehsildar', href: '/jkssb/naib-tehsildar', desc: 'Revenue Department' },
      { label: 'Patwari', href: '/jkssb/patwari', desc: 'Revenue Patwari' },
      { label: 'All Exams →', href: '/jkssb', desc: 'View all JKSSB exams' },
    ],
  },
  { label: 'Search', href: '/search' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg leading-none">JK PYQ</span>
              <span className="font-display font-bold text-brand-400 text-lg leading-none"> Hub</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    pathname.startsWith(link.href)
                      ? 'text-white bg-brand-500/15 border border-brand-500/25'
                      : 'text-white/60 hover:text-white hover:bg-surface-hover'
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>

                {/* Dropdown */}
                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-2 min-w-[220px] z-50">
                    <div className="card shadow-card-hover p-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors duration-150"
                        >
                          <span className="text-sm font-medium text-white">{child.label}</span>
                          <span className="text-xs text-white/40 mt-0.5">{child.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="btn-ghost btn-sm hidden sm:flex">
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
            </Link>
            <Link href="/admin" className="btn-primary btn-sm hidden sm:flex">
              Admin
            </Link>

            {/* Mobile toggle */}
            <button
              className="btn-ghost btn-sm md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface/95 backdrop-blur-xl">
          <div className="container-custom py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-surface-hover transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 space-y-1 mt-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-surface-hover transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 flex gap-2">
              <Link href="/search" className="btn-secondary btn-sm flex-1 justify-center" onClick={() => setMobileOpen(false)}>
                <Search className="w-4 h-4" /> Search
              </Link>
              <Link href="/admin" className="btn-primary btn-sm flex-1 justify-center" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
