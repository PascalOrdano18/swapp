import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
  }
  const supabase = await createClient()

  // Count sold items
  const { count: soldCount } = await supabase
    .from('items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'sold')

  // Count active items
  const { count: activeCount } = await supabase
    .from('items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')

  return NextResponse.json({ soldCount: soldCount || 0, activeCount: activeCount || 0 })
} 