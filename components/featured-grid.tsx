import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import ProductCard from "@/components/ProductCard"

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
  )
} 