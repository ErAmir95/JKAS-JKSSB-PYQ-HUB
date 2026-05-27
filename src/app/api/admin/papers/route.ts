import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    const body = await req.json();
    const { action, ...data } = body;

    if (action === 'toggle_publish') {
      const { id, is_published } = data;
      const { error } = await supabase
        .from('question_papers')
        .update({ is_published })
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      const { id } = data;
      // Get file path first
      const { data: paper } = await supabase
        .from('question_papers')
        .select('file_path')
        .eq('id', id)
        .single();

      if (paper?.file_path) {
        await supabase.storage.from('question-papers').remove([paper.file_path]);
      }

      const { error } = await supabase.from('question_papers').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const board = searchParams.get('board');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('question_papers')
      .select('*, subject:subjects(name), jkssb_exam:jkssb_exams(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (board) query = query.eq('board', board);

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data, count, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
