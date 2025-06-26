"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react" // Import Clock component
import ProductCard from "@/components/ProductCard"

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
        <ProductCard
          key={item.id}
          id={item.id}
          image={item.image}
          title={item.title}
          price={item.price}
          condition={item.condition}
          href={`/items/${item.id}`}
        />
      ))}
    </div>
  )
}
