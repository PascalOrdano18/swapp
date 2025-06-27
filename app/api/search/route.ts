import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''

  if (!q) {
    return NextResponse.json([])
  }

  // Search for items where title or brand matches the query AND item is active
  const { data, error } = await supabase
    .from('items')
    .select('id, title')
    .eq('status', 'active')
    .or(`title.ilike.%${q}%,brand.ilike.%${q}%`)
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const response = NextResponse.json(data)
  
  // Add cache control headers to prevent caching
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  return response
} 