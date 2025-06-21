import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

// Re-render this page every time it's visited
export const revalidate = 0

// Define the type for our featured item
type FeaturedItem = {
  id: string;
  title: string;
  price: number;
  brand: string | null;
  ai_recommendation: string | null;
  image: string;
}

async function getFeaturedItems() {
  const supabase = await createClient()
  
  // Get the most recent items, prioritizing those with "Fast Sell" recommendations
  const { data, error } = await supabase
    .from('items')
    .select(`
      id,
      title,
      price,
      brand,
      ai_recommendation,
      item_images (
        image_url,
        is_primary
      )
    `)
    .eq('status', 'active')
    .order('ai_recommendation', { ascending: false }) // "Fast Sell" comes first alphabetically
    .order('created_at', { ascending: false })
    .limit(6) // Show 6 featured items

  if (error) {
    console.error("Error fetching featured items:", error)
    return []
  }
  
  // For each item, find the primary image
  const itemsWithPrimaryImage = data.map(item => {
    const primaryImageObj = item.item_images.find(img => img.is_primary);
    const primaryImage = primaryImageObj?.image_url || item.item_images[0]?.image_url;

    return {
      ...item,
      image: primaryImage || "/placeholder.svg?height=400&width=300"
    }
  })

  return itemsWithPrimaryImage
}

export default async function FeaturedGrid() {
  const items = await getFeaturedItems()

  // If no items, show a placeholder message
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No items available yet. Be the first to list something!</p>
        <Link href="/upload">
          <Button className="mt-4 rounded-full bg-white text-black hover:bg-gray-100">
            List Your First Item
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2 md:px-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-md border border-white/20 shadow-none hover:shadow-lg hover:scale-[1.025] transition-all duration-300 flex flex-col"
          style={{ minHeight: 380 }}
        >
          <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center">
            <Link href={`/items/${item.id}`} className="block w-full h-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform group-hover:scale-105 rounded-2xl"
                style={{ borderRadius: 18 }}
              />
            </Link>
            {/* AI Badge */}
            {item.ai_recommendation && (
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-white/70 backdrop-blur text-gray-800 border border-white/40 ${
                    item.ai_recommendation === "Fast Sell"
                      ? "ring-2 ring-red-400"
                      : item.ai_recommendation === "Hold"
                      ? "ring-2 ring-green-400"
                      : "ring-2 ring-blue-400"
                  }`}
                >
                  {item.ai_recommendation === "Fast Sell" ? "Venta Rápida" : item.ai_recommendation === "Hold" ? "Esperar" : "Estándar"}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-end p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{item.brand || 'Unknown Brand'}</span>
              <span className="text-xl font-extrabold text-gray-900 drop-shadow-sm">${item.price}</span>
            </div>
            <Link href={`/items/${item.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-lg line-clamp-1 tracking-tight">
                {item.title}
              </h3>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
} 