"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ProductCard from "@/components/ProductCard"

// Mock data for items
const items = [
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
  {
    id: 5,
    title: "Palace Tri-Ferg T-Shirt",
    price: 95,
    image: "/placeholder.svg?height=400&width=300",
    seller: "skate_life",
    brand: "Palace",
    size: "M",
    condition: "Good",
    aiRecommendation: "Standard",
  },
  {
    id: 6,
    title: "Yeezy Boost 350 V2 Zebra",
    price: 320,
    image: "/placeholder.svg?height=400&width=300",
    seller: "yeezy_collector",
    brand: "Adidas",
    size: "US 9",
    condition: "New",
    aiRecommendation: "Hold",
  },
  {
    id: 7,
    title: "Chrome Hearts Hoodie",
    price: 650,
    image: "/placeholder.svg?height=400&width=300",
    seller: "luxury_reseller",
    brand: "Chrome Hearts",
    size: "L",
    condition: "Excellent",
    aiRecommendation: "Hold",
  },
  {
    id: 8,
    title: "Fear of God Essentials Sweatpants",
    price: 120,
    image: "/placeholder.svg?height=400&width=300",
    seller: "fog_fan",
    brand: "Fear of God",
    size: "M",
    condition: "Like New",
    aiRecommendation: "Fast Sell",
  },
  {
    id: 9,
    title: "Jordan 1 Retro High OG Chicago",
    price: 1800,
    image: "/placeholder.svg?height=400&width=300",
    seller: "jordan_collector",
    brand: "Nike",
    size: "US 11",
    condition: "New",
    aiRecommendation: "Hold",
  },
]

export default function ItemGrid() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [sortOption, setSortOption] = useState("newest")

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((itemId) => itemId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // Sort items based on selected option
  const sortedItems = [...items].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return 0 // Keep original order for "newest"
    }
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{items.length}</strong> results
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
              Sort by:{" "}
              {sortOption === "newest"
                ? "Newest"
                : sortOption === "price-low"
                  ? "Price: Low to High"
                  : "Price: High to Low"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("price-low")}>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("price-high")}>Price: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedItems.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            price={item.price}
            condition={item.condition}
            href={`/items/${item.id}`}
            isFavorite={favorites.includes(item.id)}
            onFavorite={() => toggleFavorite(item.id)}
          />
        ))}
      </div>
    </div>
  )
}
