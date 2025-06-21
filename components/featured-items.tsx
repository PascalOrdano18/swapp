"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react" // Import Clock component

// Mock data for featured items
const featuredItems = [
  {
    id: 1,
    title: "Supreme Box Logo Hoodie",
    price: 450,
    image: "/placeholder.svg?height=400&width=300",
    seller: "streetwear_king",
    brand: "Supreme",
    size: "L",
    condition: "Like New",
    aiRecommendation: "Fast Sell",
  },
  {
    id: 2,
    title: "Nike SB Dunk Low Travis Scott",
    price: 1200,
    image: "/placeholder.svg?height=400&width=300",
    seller: "sneakerhead99",
    brand: "Nike",
    size: "US 10",
    condition: "New",
    aiRecommendation: "Hold",
  },
  {
    id: 3,
    title: "Bape Camo Shark Hoodie",
    price: 320,
    image: "/placeholder.svg?height=400&width=300",
    seller: "hypebeast_collector",
    brand: "Bape",
    size: "M",
    condition: "Good",
    aiRecommendation: "Standard",
  },
  {
    id: 4,
    title: "Off-White Industrial Belt",
    price: 180,
    image: "/placeholder.svg?height=400&width=300",
    seller: "fashion_forward",
    brand: "Off-White",
    size: "One Size",
    condition: "Excellent",
    aiRecommendation: "Fast Sell",
  },
]

export default function FeaturedItems() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <Link href={`/items/${item.id}`}>
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={300}
                    height={400}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              </Link>
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge
                  variant={
                    item.aiRecommendation === "Fast Sell"
                      ? "destructive"
                      : item.aiRecommendation === "Hold"
                        ? "outline"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {item.aiRecommendation === "Fast Sell" && <Clock className="mr-1 h-3 w-3" />}
                  {item.aiRecommendation}
                </Badge>
                <span className="text-sm text-muted-foreground">{item.brand}</span>
              </div>
              <Link href={`/items/${item.id}`}>
                <h3 className="mb-1 font-medium line-clamp-1">{item.title}</h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="font-bold">${item.price}</p>
                <p className="text-sm text-muted-foreground">
                  {item.size} · {item.condition}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Listed by <span className="font-medium">{item.seller}</span>
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
