import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import SortDropdown from "./sort-dropdown"
import ProductCard from "@/components/ProductCard"

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
    full_name: string | null;
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
        full_name
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

export default async function FeedGrid({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const items = await getItems(params)

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
          <ProductCard
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            price={item.price}
            href={`/items/${item.id}`}
          />
        ))}
      </div>
    </div>
  )
} 