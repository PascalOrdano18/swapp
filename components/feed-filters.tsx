"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FeedFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [localPriceRange, setLocalPriceRange] = useState([
    Number(searchParams.get('minPrice') || 0),
    Number(searchParams.get('maxPrice') || 2000)
  ])

  useEffect(() => {
    setLocalPriceRange([
      Number(searchParams.get('minPrice') || 0),
      Number(searchParams.get('maxPrice') || 2000)
    ])
  }, [searchParams])

  const debouncedPushState = useDebouncedCallback((newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, 300)

  const handlePriceCommit = (newRange: number[]) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('minPrice', String(newRange[0]))
    params.set('maxPrice', String(newRange[1]))
    debouncedPushState(params);
  }

  const handleCheckboxChange = useCallback((category: 'brands' | 'ai', value: string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.get(category)?.split(',') || []
    
    let newValues: string[] = []
    if (isChecked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    if (newValues.length > 0) {
      params.set(category, newValues.join(','))
    } else {
      params.delete(category)
    }
    debouncedPushState(params);
  }, [searchParams, debouncedPushState])
  
  const clearFilters = () => {
    router.push(pathname, { scroll: false })
  }

  const selectedBrands = searchParams.get('brands')?.split(',') || []
  const selectedRecs = searchParams.get('ai')?.split(',') || []

  return (
    <div className="sticky top-24 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white/70 hover:bg-white/10 hover:text-white">
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['price', 'brands', 'ai']} className="w-full">
        <AccordionItem value="price" className="border-b border-white/10">
          <AccordionTrigger className="py-4 text-white hover:no-underline">
            <span className="font-semibold">Price Range</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <Slider
              value={localPriceRange}
              min={0}
              max={2000}
              step={10}
              onValueChange={setLocalPriceRange}
              onValueCommit={handlePriceCommit}
              className="py-2"
            />
            <div className="flex justify-between text-sm text-white/80 mt-2">
              <span>${localPriceRange[0]}</span>
              <span>${localPriceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands" className="border-b border-white/10">
          <AccordionTrigger className="py-4 text-white hover:no-underline">
            <span className="font-semibold">Brands</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            {["Supreme", "Nike", "Adidas", "Bape", "Off-White"].map((brand) => (
              <div key={brand} className="flex items-center space-x-3">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => handleCheckboxChange('brands', brand, !!checked)}
                  className="border-white/50 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
                <Label htmlFor={`brand-${brand}`} className="text-sm text-white/90 font-light cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai" className="border-none">
          <AccordionTrigger className="py-4 text-white hover:no-underline">
            <span className="font-semibold">AI Recommendations</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            {["Fast Sell", "Standard", "Hold"].map((rec) => (
              <div key={rec} className="flex items-center space-x-3">
                <Checkbox 
                  id={`ai-${rec}`} 
                  checked={selectedRecs.includes(rec)}
                  onCheckedChange={(checked) => handleCheckboxChange('ai', rec, !!checked)}
                  className="border-white/50 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
                <Label htmlFor={`ai-${rec}`} className="text-sm text-white/90 font-light cursor-pointer">
                  {rec}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
