import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const supabase = await createClient()
  if (token) {
    await supabase.auth.setSession({ access_token: token, refresh_token: '' })
  }
  const { full_name, contact, avatar_url, bio } = await req.json()

  // Get user id from session (with token)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('User error:', userError)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, contact, avatar_url, bio })
    .eq('id', user.id)

  if (error) {
    console.error('DB update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
} 