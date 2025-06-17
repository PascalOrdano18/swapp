"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const items = [
  {
    id: 1,
    title: "Supreme Box Logo Hoodie",
    price: 450,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Supreme",
    aiPrice: "Fast Sell",
  },
  {
    id: 2,
    title: "Travis Scott Jordan 1",
    price: 1200,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Nike",
    aiPrice: "Hold",
  },
  {
    id: 3,
    title: "Bape Shark Hoodie",
    price: 320,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Bape",
    aiPrice: "Standard",
  },
  {
    id: 4,
    title: "Off-White Belt",
    price: 180,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Off-White",
    aiPrice: "Fast Sell",
  },
  {
    id: 5,
    title: "Palace Tri-Ferg Tee",
    price: 95,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Palace",
    aiPrice: "Standard",
  },
  {
    id: 6,
    title: "Yeezy 350 Zebra",
    price: 320,
    image: "/placeholder.svg?height=400&width=300",
    brand: "Adidas",
    aiPrice: "Hold",
  },
]

export default function FeaturedGrid() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
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
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform group-hover:scale-105 rounded-2xl"
                style={{ borderRadius: 18 }}
              />
            </Link>
            {/* AI Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-white/70 backdrop-blur text-gray-800 border border-white/40 ${
                  item.aiPrice === "Fast Sell"
                    ? "ring-2 ring-red-400"
                    : item.aiPrice === "Hold"
                    ? "ring-2 ring-green-400"
                    : "ring-2 ring-blue-400"
                }`}
              >
                {item.aiPrice}
              </span>
            </div>
            {/* Heart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur border border-white/40 shadow-sm"
              onClick={() => toggleFavorite(item.id)}
              style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)' }}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              />
            </Button>
          </div>
          <div className="flex-1 flex flex-col justify-end p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{item.brand}</span>
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
