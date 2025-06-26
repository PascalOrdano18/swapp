'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, TrendingUp } from "lucide-react"
import React from "react"

export interface ProductCardProps {
  id: string | number
  image: string
  title: string
  price: number
  oldPrice?: number | null
  condition?: string | null // Nuevo, Como nuevo, Usado, etc.
  soldCount?: number | null
  href?: string
  isFavorite?: boolean
  onFavorite?: (() => void) | null
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  price,
  oldPrice = null,
  condition,
  soldCount = null,
  href = `/items/${id}`,
  isFavorite = false,
  onFavorite = null,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-2xl shadow-md flex flex-col items-stretch p-4 min-h-[320px] transition-all duration-200 bg-gradient-to-br from-[#181A2A] via-[#23244D] to-[#2B225A] dark:from-[#181A2A] dark:via-[#23244D] dark:to-[#2B225A] border border-transparent hover:border-violet-400/60 hover:shadow-[0_0_16px_0_rgba(139,92,246,0.18)] hover:scale-[1.0125] group overflow-hidden ${className}`}
      style={{ boxShadow: "0 2px 16px 0 rgba(139, 92, 246, 0.08)" }}
    >
      {/* Violet glowing effect on hover */}
      <div className="pointer-events-none absolute -inset-4 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(circle at 60% 40%, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.10) 70%, transparent 100%)'}} />
      {/* Heart Icon */}
      {onFavorite && (
        <button
          className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={e => {
            e.preventDefault();
            onFavorite();
          }}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-500 dark:text-zinc-400'}`} />
        </button>
      )}
      {/* Image */}
      <Link href={href} className="block w-full flex-1 flex items-center justify-center mb-4 relative z-10">
        <div className="relative w-full aspect-[4/3] flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:scale-103 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>
      </Link>
      {/* Info */}
      <div className="flex flex-col items-stretch gap-1 mt-2 relative z-10">
        {/* Title */}
        <Link href={href}>
          <h3 className="font-semibold text-base text-white line-clamp-2 leading-tight mb-0 hover:text-purple-300 transition-colors">
            {title}
          </h3>
        </Link>
        {/* Condition */}
        {condition && (
          <div className="text-xs text-blue-200 font-medium mb-1 line-clamp-1">{condition}</div>
        )}
        {/* Old Price */}
        {oldPrice && (
          <div className="text-xs text-blue-300/70 line-through mb-[-2px]">${oldPrice.toFixed(2)}</div>
        )}
        {/* Price and Sold Row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">${price.toFixed(2)}</span>
            {soldCount !== null && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/40 text-xs font-semibold text-blue-100 border border-blue-400/30">
                <TrendingUp className="h-3 w-3" />
                {soldCount} sold
              </span>
            )}
          </div>
          {/* Cart Icon (optional, for future quick add) */}
          {/* <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingCart className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default ProductCard; 