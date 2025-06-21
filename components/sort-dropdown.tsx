'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SortDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortValue)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 rounded-full border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white focus:ring-offset-black">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/80 backdrop-blur-lg border-white/20 text-white">
        {sortOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            className="cursor-pointer focus:bg-white/10"
            onSelect={() => setSort(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 