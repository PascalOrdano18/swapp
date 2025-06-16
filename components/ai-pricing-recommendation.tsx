"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Clock, ArrowRight } from "lucide-react"

interface AIPricingRecommendationProps {
  isLoading: boolean
  price: number | null
  sellSpeed: number
  onGenerate: () => void
}

export default function AIPricingRecommendation({
  isLoading,
  price,
  sellSpeed,
  onGenerate,
}: AIPricingRecommendationProps) {
  // Determine recommendation type based on sell speed
  const getRecommendationType = () => {
    if (sellSpeed < 33) return "Fast Sell"
    if (sellSpeed < 66) return "Standard"
    return "Hold"
  }

  const recommendationType = getRecommendationType()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">AI Price Recommendation</h3>

      {!price && !isLoading && (
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <Sparkles className="mb-4 h-12 w-12 text-rose-500" />
          <h4 className="mb-2 text-xl font-medium">Get AI Pricing Help</h4>
          <p className="mb-4 text-muted-foreground">
            Our AI will analyze similar items and market trends to suggest the optimal price based on your selling
            timeframe.
          </p>
          <Button onClick={onGenerate}>
            Generate Price Recommendation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      )}

      {isLoading && (
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 h-12 w-12 animate-pulse rounded-full bg-rose-100 dark:bg-rose-900"></div>
          <h4 className="mb-2 text-xl font-medium">Analyzing Market Data</h4>
          <p className="mb-4 text-muted-foreground">Our AI is analyzing similar items and current market trends...</p>
          <div className="h-10 w-48 animate-pulse rounded-md bg-muted"></div>
        </Card>
      )}

      {price && (
        <Card className="overflow-hidden">
          <div
            className={`p-4 text-white ${
              recommendationType === "Fast Sell"
                ? "bg-rose-500"
                : recommendationType === "Standard"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">AI Recommendation</h4>
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs">
                {recommendationType === "Fast Sell" && <Clock className="h-3 w-3" />}
                {recommendationType}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-baseline justify-center">
              <span className="text-3xl font-bold">${price}</span>
              <span className="ml-1 text-sm text-muted-foreground">suggested price</span>
            </div>

            <p className="mb-4 text-center text-sm text-muted-foreground">
              {recommendationType === "Fast Sell"
                ? "This price is optimized for a quick sale, typically within 1-2 weeks."
                : recommendationType === "Standard"
                  ? "This price balances selling time and value, typically selling within 3-4 weeks."
                  : "This price maximizes your return but may take longer to sell (4+ weeks)."}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-muted p-2">
                <p className="font-medium">-10%</p>
                <p className="text-muted-foreground">${Math.round(price * 0.9)}</p>
                <p className="text-muted-foreground">Faster</p>
              </div>
              <div className="rounded-md bg-rose-100 p-2 dark:bg-rose-950">
                <p className="font-medium">Suggested</p>
                <p className="text-rose-500">${price}</p>
                <p className="text-muted-foreground">Balanced</p>
              </div>
              <div className="rounded-md bg-muted p-2">
                <p className="font-medium">+10%</p>
                <p className="text-muted-foreground">${Math.round(price * 1.1)}</p>
                <p className="text-muted-foreground">Slower</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
