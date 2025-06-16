"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const items = [
  {
    id: 1,
    title: "Supreme Box Logo Hoodie",
    price: 450,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Supreme",
    aiPrice: "Fast Sell",
    seller: "streetwear_king",
  },
  {
    id: 2,
    title: "Travis Scott Jordan 1",
    price: 1200,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Nike",
    aiPrice: "Hold",
    seller: "sneakerhead99",
  },
  {
    id: 3,
    title: "Bape Shark Hoodie",
    price: 320,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Bape",
    aiPrice: "Standard",
    seller: "hypebeast_collector",
  },
  {
    id: 4,
    title: "Off-White Belt",
    price: 180,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Off-White",
    aiPrice: "Fast Sell",
    seller: "fashion_forward",
  },
  {
    id: 5,
    title: "Palace Tri-Ferg Tee",
    price: 95,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Palace",
    aiPrice: "Standard",
    seller: "skate_life",
  },
  {
    id: 6,
    title: "Yeezy 350 Zebra",
    price: 320,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Adidas",
    aiPrice: "Hold",
    seller: "yeezy_collector",
  },
]

export default function FeedGrid() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("newest")

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div>
      {/* Sort */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{items.length} items</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("price-low")}>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("price-high")}>Price: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl bg-white border hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden">
              <Link href={`/items/${item.id}`}>
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </Link>

              {/* AI Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.aiPrice === "Fast Sell"
                      ? "bg-red-100 text-red-700"
                      : item.aiPrice === "Hold"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.aiPrice}
                </span>
              </div>

              {/* Heart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={() => toggleFavorite(item.id)}
              >
                <Heart
                  className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </Button>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">{item.brand}</span>
                <span className="text-lg font-black">${item.price}</span>
              </div>
              <Link href={`/items/${item.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {item.title}
                </h3>
              </Link>
              <p className="text-xs text-gray-500">by {item.seller}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
