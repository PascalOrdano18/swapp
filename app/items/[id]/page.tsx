import Image from "next/image"
import { notFound } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import ImageGallery from "@/components/ImageGallery"

// This tells Next.js not to cache this page, so we always get fresh data.
export const revalidate = 0

interface ImageRecord {
  image_url: string;
  is_primary: boolean;
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the item data including related seller (profiles) and images (item_images)
  const { data: item } = await supabase
    .from('items')
    .select(`
      *,
      profiles (
        username,
        avatar_url,
        rating
      ),
      item_images (
        image_url,
        is_primary
      )
    `)
    .eq('id', id)
    .single()

  // If no item is found, show a 404 page
  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-4 pt-16">
      {/* Magical background glows */}
      <div className="pointer-events-none select-none absolute -top-72 left-1/4 w-[520px] h-[700px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 right-1/4 w-[520px] h-[420px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 z-10">
          {/* Left: Images */}
          <ImageGallery images={item.item_images} title={item.title} />

          {/* Right: Info */}
          <div className="flex flex-col gap-6 justify-start w-full max-w-md mx-auto">
            {/* Brand badge */}
            {item.ai_recommendation && (
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1 text-xs font-medium shadow-lg border-none">{item.ai_recommendation}</Badge>
              </div>
            )}
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 leading-tight">{item.title}</h1>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">${item.price}</div>
            </div>
            {/* Key Info */}
            <div className="flex flex-wrap gap-2 mb-2">
              {item.brand && <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm font-medium text-white/80">{item.brand}</span>}
              {item.size && <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm font-medium text-white/80">{item.size}</span>}
              {item.condition && <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm font-medium text-white/80">{item.condition}</span>}
            </div>
            {/* Buttons */}
            <div className="flex gap-3 mb-2">
              <button className="flex-1 py-3 rounded-full font-bold text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-black">Buy Now</button>
              <button className="flex-1 py-3 rounded-full font-semibold text-base border border-white/20 text-white/80 bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-black flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" /> Message Seller
              </button>
            </div>
            {/* Seller Card */}
            {item.profiles && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/20">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-purple-400">
                  <Image 
                    src={item.profiles.avatar_url || "/placeholder.svg?height=100&width=100"} 
                    alt={item.profiles.username || 'Seller Avatar'} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-semibold text-white text-sm">{item.profiles.username || 'Anonymous Seller'}</span>
                  <span className="text-xs text-white/60">{item.profiles.rating || 0} ★</span>
                </div>
              </div>
            )}
            {/* Description & Details */}
            <div className="rounded-2xl p-6 bg-white/10 border border-white/20">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/5 rounded-xl border border-white/10">
                  <TabsTrigger value="description" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">Description</TabsTrigger>
                  <TabsTrigger value="details" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-2">
                  <p className="text-white/70 leading-relaxed text-sm">{item.description}</p>
                </TabsContent>
                <TabsContent value="details" className="mt-2">
                  <div className="space-y-2">
                    {item.brand && <div className="flex justify-between py-2 text-sm border-b border-white/10"><span className="font-medium capitalize text-white/60">Brand</span><span className="text-white/90">{item.brand}</span></div>}
                    {item.size && <div className="flex justify-between py-2 text-sm border-b border-white/10"><span className="font-medium capitalize text-white/60">Size</span><span className="text-white/90">{item.size}</span></div>}
                    {item.condition && <div className="flex justify-between py-2 text-sm border-b border-white/10 last:border-none"><span className="font-medium capitalize text-white/60">Condition</span><span className="text-white/90">{item.condition}</span></div>}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
