import Link from "next/link"
import Image from "next/image"
import { Heart, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server"

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

async function getItems() {
  const supabase = await createClient()
  const { data, error } = await supabase
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
    .order('created_at', { ascending: false })

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

export default async function FeedGrid() {
  const items = await getItems()

  return (
    <div>
      {/* Sort */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-300">{items.length} items</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full border-white/20 text-white hover:bg-white/10">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Newest</DropdownMenuItem>
            <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden">
              <Link href={`/items/${item.id}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </Link>

              {/* AI Badge */}
              {item.ai_recommendation && (
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white shadow-md ${
                      item.ai_recommendation === "Fast Sell"
                        ? "bg-red-500/80"
                        : item.ai_recommendation === "Hold"
                          ? "bg-green-500/80"
                          : "bg-blue-500/80"
                    }`}
                  >
                    {item.ai_recommendation}
                  </span>
                </div>
              )}

              {/* Heart Button (dummy functionality) */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70 font-medium">{item.brand}</span>
                <span className="text-lg font-black text-white">${item.price}</span>
              </div>
              <Link href={`/items/${item.id}`} className="flex-grow">
                <h3 className="font-semibold text-white hover:text-violet-300 transition-colors line-clamp-1 mb-1">
                  {item.title}
                </h3>
              </Link>
              <p className="text-xs text-white/60">by {item.profiles?.username || 'anonymous'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 