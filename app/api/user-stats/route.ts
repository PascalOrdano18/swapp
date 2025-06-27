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
    .eq('seller_id', userId)
    .eq('status', 'sold')

  // Count active items
  const { count: activeCount } = await supabase
    .from('items')
    .select('id', { count: 'exact', head: true })
    .eq('seller_id', userId)
    .eq('status', 'active')

  // Get total sales value
  const { data: soldItems } = await supabase
    .from('items')
    .select('price')
    .eq('seller_id', userId)
    .eq('status', 'sold')

  const totalSalesValue = soldItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0

  // Get average price of active items
  const { data: activeItems } = await supabase
    .from('items')
    .select('price')
    .eq('seller_id', userId)
    .eq('status', 'active')

  const averagePrice = activeItems && activeItems.length > 0 
    ? activeItems.reduce((sum, item) => sum + (item.price || 0), 0) / activeItems.length 
    : 0

  // Get recent activity (last 5 items created)
  const { data: recentItems } = await supabase
    .from('items')
    .select('id, title, price, status, created_at')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get top performing items (highest priced active items)
  const { data: topItems } = await supabase
    .from('items')
    .select('id, title, price, status')
    .eq('seller_id', userId)
    .eq('status', 'active')
    .order('price', { ascending: false })
    .limit(3)

  // Get items by status for chart data
  const { data: statusBreakdown } = await supabase
    .from('items')
    .select('status')
    .eq('seller_id', userId)

  const statusCounts = statusBreakdown?.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return NextResponse.json({ 
    soldCount: soldCount || 0, 
    activeCount: activeCount || 0,
    totalSalesValue,
    averagePrice: Math.round(averagePrice * 100) / 100,
    recentItems: recentItems || [],
    topItems: topItems || [],
    statusBreakdown: statusCounts
  })
} 