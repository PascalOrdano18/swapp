import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const item = {
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
}

export default function ItemPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center items-start py-16 px-4 mt-20">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Images */}
        <div className="flex flex-col gap-6 items-center">
          <div className="w-full aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
            <Image
              src={item.images[0]}
              alt={item.title}
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-3 w-full justify-center">
            {item.images.slice(1).map((img, i) => (
              <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
                <Image src={img} alt={item.title + ' thumb'} width={80} height={80} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Right: Info */}
        <div className="flex flex-col gap-8 justify-start w-full max-w-md mx-auto">
          {/* Brand badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1 text-xs font-medium shadow-none border-none">{item.aiRecommendation}</Badge>
          </div>
          {/* Title & Price */}
          <div>
            <h1 className="text-3xl font-extrabold text-primary mb-2 leading-tight">{item.title}</h1>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">${item.price}</div>
          </div>
          {/* Key Info */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="rounded bg-secondary/60 px-3 py-1 text-sm font-medium">{item.brand}</span>
            <span className="rounded bg-secondary/60 px-3 py-1 text-sm font-medium">{item.size}</span>
            <span className="rounded bg-secondary/60 px-3 py-1 text-sm font-medium">{item.condition}</span>
          </div>
          {/* Buttons */}
          <div className="flex gap-3 mb-2">
            <button className="flex-1 py-2 rounded-full font-bold text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">Buy Now</button>
            <button className="flex-1 py-2 rounded-full font-semibold text-base border border-primary/20 text-primary bg-transparent hover:bg-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5" /> Message Seller
            </button>
          </div>
          {/* Seller Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/60">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary">
              <Image src={item.seller.avatar} alt={item.seller.username} fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-primary text-sm">{item.seller.username}</span>
              <span className="text-xs text-muted-foreground">{item.seller.rating} ★</span>
            </div>
          </div>
          {/* Description & Details */}
          <div className="rounded-2xl p-6 bg-secondary/40">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-2 mb-2 bg-secondary/60 rounded-xl">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-2">
                <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
              </TabsContent>
              <TabsContent value="details" className="mt-2">
                <div className="space-y-1">
                  {Object.entries(item.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 text-xs border-b border-transparent last:border-none">
                      <span className="font-medium capitalize text-primary/80">{key}</span>
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
