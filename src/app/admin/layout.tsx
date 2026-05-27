import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Check admin profile
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <AdminSidebar user={{ email: user.email || '', ...profile }} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
