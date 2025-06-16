"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function FeedFilters() {
  const [priceRange, setPriceRange] = useState([0, 1000])

  return (
    <div className="sticky top-24 space-y-6 rounded-2xl border bg-white p-6 text-black">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" className="text-black">
          Clear
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="font-medium text-black">Price Range</Label>
        <Slider value={priceRange} min={0} max={2000} step={10} onValueChange={setPriceRange} className="py-4" />
        <div className="flex justify-between text-sm text-black">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <Label className="font-medium text-black">Brands</Label>
        <div className="space-y-2">
          {["Supreme", "Nike", "Adidas", "Bape", "Off-White"].map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand} />
              <Label htmlFor={brand} className="text-sm text-black">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-3">
        <Label className="font-medium text-black">AI Recommendations</Label>
        <div className="space-y-2">
          {["Fast Sell", "Standard", "Hold"].map((rec) => (
            <div key={rec} className="flex items-center space-x-2">
              <Checkbox id={rec} />
              <Label htmlFor={rec} className="text-sm text-black">
                {rec}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
