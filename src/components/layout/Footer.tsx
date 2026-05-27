import Link from 'next/link';
import { BookOpen, Github, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  'JKAS': [
    { label: 'Prelims', href: '/jkas/prelims' },
    { label: 'Mains', href: '/jkas/mains' },
    { label: 'Optional Subjects', href: '/jkas/optional' },
  ],
  'JKSSB': [
    { label: 'JKPSI', href: '/jkssb/jkpsi' },
    { label: 'Naib Tehsildar', href: '/jkssb/naib-tehsildar' },
    { label: 'Patwari', href: '/jkssb/patwari' },
    { label: 'All Exams', href: '/jkssb' },
  ],
  'Platform': [
    { label: 'Search', href: '/search' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-card/30 mt-20">
      <div className="container-custom py-14">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">JK PYQ Hub</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              The most comprehensive repository of Previous Year Question Papers for JKAS and JKSSB examinations. Free, fast, and always up to date.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="mailto:contact@jkpyqhub.com" className="btn-ghost btn-sm text-white/40 w-9 h-9 p-0 rounded-lg">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm text-white/40 w-9 h-9 p-0 rounded-lg">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white text-sm mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
          <p>© {new Date().getFullYear()} JK PYQ Hub. All rights reserved.</p>
          <p>Made for JKAS & JKSSB aspirants of Jammu & Kashmir</p>
        </div>
      </div>
    </footer>
  );
}
