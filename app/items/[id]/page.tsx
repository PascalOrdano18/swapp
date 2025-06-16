import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Heart, MessageCircle, Share2 } from "lucide-react"

// Mock data for a single item
const items = [
  {
    id: "1",
    title: "Supreme Box Logo Hoodie",
    price: 450,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600&text=Image+2",
      "/placeholder.svg?height=600&width=600&text=Image+3",
    ],
    seller: {
      username: "streetwear_king",
      rating: 4.9,
      sales: 42,
      joined: "May 2022",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    brand: "Supreme",
    size: "L",
    condition: "Like New",
    aiRecommendation: "Fast Sell",
    description:
      "Authentic Supreme Box Logo Hoodie from FW21 collection. Worn only a few times, in excellent condition with no flaws. Classic black colorway with red box logo. Ships with original packaging and receipt.",
    details: {
      color: "Black",
      material: "Cotton",
      release: "FW21",
      style: "Box Logo",
    },
  },
]

export default function ItemPage({ params }: { params: { id: string } }) {
  const item = items.find(item => item.id === params.id)
  
  if (!item) {
    notFound()
  }
  
  return (
    <div className="container py-12">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <Image
              src={item.images[0] || "/placeholder.svg"}
              alt={item.title}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {item.images.slice(1).map((image, index) => (
              <div key={index} className="overflow-hidden rounded-xl border">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${item.title} image ${index + 2}`}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Item Details */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <Badge
                variant={
                  item.aiRecommendation === "Fast Sell"
                    ? "destructive"
                    : item.aiRecommendation === "Hold"
                    ? "outline"
                    : "secondary"
                }
              >
                {item.aiRecommendation === "Fast Sell" && <Clock className="mr-1 h-3 w-3" />}
                {item.aiRecommendation}
              </Badge>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <p className="text-2xl font-bold text-rose-600 mb-4">${item.price}</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="rounded-md bg-muted px-3 py-1 text-sm">Brand: <span className="font-medium">{item.brand}</span></div>
              <div className="rounded-md bg-muted px-3 py-1 text-sm">Size: <span className="font-medium">{item.size}</span></div>
              <div className="rounded-md bg-muted px-3 py-1 text-sm">Condition: <span className="font-medium">{item.condition}</span></div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 transition-all duration-200 shadow-md">Buy Now</Button>
            <Button variant="outline" size="lg" className="transition-all duration-200"> <MessageCircle className="mr-2 h-4 w-4" /> Message Seller </Button>
          </div>
          <div className="rounded-xl border p-5 bg-muted/40">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border">
                <Image
                  src={item.seller.avatar || "/placeholder.svg"}
                  alt={item.seller.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.seller.username}</h3>
                  <Badge variant="secondary">{item.seller.rating} ★</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.seller.sales} sales · Joined {item.seller.joined}</p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <div className="space-y-2">
                  {Object.entries(item.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b py-2">
                      <span className="font-medium capitalize">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
