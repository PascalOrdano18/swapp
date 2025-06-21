import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import SortDropdown from "./sort-dropdown"

// Re-render this page every time it's visited
export const revalidate = 0

// Define the type for our item, including the joined data
type Item = {
  id: string;
  title: string;
  price: number;
  brand: string | null;
  ai_recommendation: string | null;
  profiles: {
    username: string | null;
  } | null;
  item_images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

type SearchParams = { [key: string]: string | string[] | undefined }

async function getItems(searchParams: SearchParams) {
  const supabase = await createClient()

  const sort = searchParams?.sort as string | undefined
  const brands = (searchParams?.brands as string)?.split(',')
  const minPrice = searchParams?.minPrice as string | undefined
  const maxPrice = searchParams?.maxPrice as string | undefined
  const aiRecs = (searchParams?.ai as string)?.split(',')

  let query = supabase
    .from('items')
    .select(`
      id,
      title,
      price,
      brand,
      ai_recommendation,
      profiles (
        username
      ),
      item_images (
        image_url,
        is_primary
      )
    `)
    .eq('status', 'active')

  // Apply filters
  if (brands && brands.length > 0) {
    query = query.in('brand', brands)
  }
  if (minPrice) {
    query = query.gte('price', Number(minPrice))
  }
  if (maxPrice && Number(maxPrice) > 0) {
    query = query.lte('price', Number(maxPrice))
  }
  if (aiRecs && aiRecs.length > 0) {
    query = query.in('ai_recommendation', aiRecs)
  }

  // Apply sorting
  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false })
  } else { // default to newest
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching items:", error)
    return []
  }
  
  // For each item, find the primary image
  const itemsWithPrimaryImage = data.map(item => {
    // The type from Supabase can be an array for linked tables, but we know it's a single profile
    const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
    
    const primaryImageObj = item.item_images.find(img => img.is_primary);
    const primaryImage = primaryImageObj?.image_url || item.item_images[0]?.image_url;

    return {
      ...item,
      profiles: profile, // ensure profiles is an object
      image: primaryImage || "/placeholder.svg?height=400&width=300"
    }
  })

  return itemsWithPrimaryImage
}

// NOTE: Sorting and favoriting are now client-side only and will reset on navigation.
// To make them persistent, we would need to add state management (or use URL state) and 
// create a `favorites` table in the database.

export default async function FeedGrid({ searchParams }: { searchParams: SearchParams }) {
  const items = await getItems(searchParams)

  return (
    <div>
      {/* Sort */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-medium text-white/60">{items.length} items</p>
        <SortDropdown />
      </div>

      {/* Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:shadow-purple-500/10 hover:shadow-2xl hover:border-white/20 transition-all duration-300 break-inside-avoid"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Link href={`/items/${item.id}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/80 transition-all duration-300" />
              </Link>

              {/* AI Badge */}
              {item.ai_recommendation && (
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md ${
                      item.ai_recommendation === "Fast Sell"
                        ? "bg-red-500/70"
                        : item.ai_recommendation === "Hold"
                          ? "bg-green-500/70"
                          : "bg-blue-500/70"
                    }`}
                  >
                    {item.ai_recommendation}
                  </span>
                </div>
              )}

            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-white/70 font-medium line-clamp-1">{item.brand}</span>
                <span className="text-2xl font-bold text-white tracking-tight">${item.price}</span>
              </div>
              <Link href={`/items/${item.id}`} className="block mt-[-4px]">
                <h3 className="font-semibold text-lg text-white hover:text-purple-300 transition-colors line-clamp-2 leading-tight mb-1">
                  {item.title}
                </h3>
              </Link>
              <p className="text-sm text-white/60">by {item.profiles?.username || 'anonymous'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 