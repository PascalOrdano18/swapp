import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''

  if (!q) {
    return NextResponse.json([])
  }

  // Search for items where title or brand matches the query
  const { data, error } = await supabase
    .from('items')
    .select('id, title')
    .or(`title.ilike.%${q}%,brand.ilike.%${q}%`)
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
} 