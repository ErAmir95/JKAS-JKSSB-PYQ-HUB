'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Upload, FileText, Settings,
  LogOut, BookOpen, ChevronRight, Users
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AdminSidebarProps {
  user: { email: string; full_name?: string | null; role: string };
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Upload Paper', href: '/admin/upload', icon: Upload },
  { label: 'All Papers', href: '/admin/papers', icon: FileText },
  { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-64 border-r border-surface-border bg-surface-card flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-none">JK PYQ Hub</div>
            <div className="text-xs text-white/30 mt-0.5">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/25'
                  : 'text-white/50 hover:text-white hover:bg-surface-hover'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-brand-400' : 'text-white/30 group-hover:text-white/60')} />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-brand-400/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Quick link to site */}
      <div className="p-3 border-t border-surface-border">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-surface-hover"
        >
          <BookOpen className="w-3.5 h-3.5" />
          View Live Site
        </Link>
      </div>

      {/* User */}
      <div className="p-3 border-t border-surface-border">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-hover">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand-400">
              {(user.full_name || user.email).slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{user.full_name || user.email}</div>
            <div className="text-xs text-white/30 capitalize">{user.role}</div>
          </div>
          <button
            onClick={signOut}
            className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
