import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  const supabase = await createClient()

  const { data: items, error } = await supabase
    .from('items')
    .select('id, title')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching trending items:', error)
    return NextResponse.json({ error: 'Failed to fetch trending items' }, { status: 500 })
  }

  return NextResponse.json(items)
} 