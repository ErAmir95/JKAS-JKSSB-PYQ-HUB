import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { FileText, Download, Eye, Upload, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admin Dashboard | JK PYQ Hub' };

async function getDashboardData() {
  const supabase = createServerSupabaseClient();

  const [papersRes, publishedRes, recentRes] = await Promise.all([
    supabase.from('question_papers').select('id, board, is_published, view_count, download_count'),
    supabase.from('question_papers').select('id').eq('is_published', true),
    supabase.from('question_papers')
      .select('id, title, board, year, is_published, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const papers = papersRes.data || [];
  const totalViews = papers.reduce((sum, p) => sum + (p.veiws || 0), 0);
  const totalDownloads = papers.reduce((sum, p) => sum + (p.downloads || 0), 0);

  return {
    total: papers.length,
    published: (publishedRes.data || []).length,
    totalViews,
    totalDownloads,
    jkas: papers.filter(p => p.board === 'JKAS').length,
    jkssb: papers.filter(p => p.board === 'JKSSB').length,
    recent: recentRes.data || [],
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    { label: 'Total Papers', value: data.total, icon: FileText, color: '#5a63f5' },
    { label: 'Published', value: data.published, icon: TrendingUp, color: '#4ade80' },
    { label: 'Total Views', value: formatNumber(data.totalViews), icon: Eye, color: '#2dd4bf' },
    { label: 'Downloads', value: formatNumber(data.totalDownloads), icon: Download, color: '#f5c842' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Overview of JK PYQ Hub</p>
        </div>
        <Link href="/admin/upload" className="btn-primary">
          <Upload className="w-4 h-4" />
          Upload Paper
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Board split */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Papers by Board</h2>
          <div className="space-y-3">
            {[
              { label: 'JKAS', count: data.jkas, color: '#5a63f5', total: data.total },
              { label: 'JKSSB', count: data.jkssb, color: '#2dd4bf', total: data.total },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/70">{item.label}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Upload Paper', href: '/admin/upload', color: '#5a63f5' },
              { label: 'Manage Papers', href: '/admin/dashboard', color: '#2dd4bf' },
              { label: 'View Site', href: '/', color: '#f5c842' },
              { label: 'Manage Subjects', href: '/admin/subjects', color: '#fb7185' },
            ].map(action => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-colors"
                style={{ background: `${action.color}10`, border: `1px solid ${action.color}20` }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent uploads */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="font-semibold text-white">Recent Uploads</h2>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Clock className="w-3.5 h-3.5" />
            Latest 10
          </div>
        </div>
        <div className="divide-y divide-surface-border">
          {data.recent.length === 0 ? (
            <div className="px-6 py-8 text-center text-white/30 text-sm">No papers uploaded yet</div>
          ) : (
            data.recent.map(paper => (
              <div key={paper.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: paper.board === 'JKAS' ? '#5a63f5' : '#2dd4bf' }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-white/80 truncate">{paper.title}</p>
                    <p className="text-xs text-white/30">{paper.board} · {paper.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <span className={`badge text-xs ${paper.is_published ? 'badge-teal' : 'bg-surface-border text-white/30'}`}>
                    {paper.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
