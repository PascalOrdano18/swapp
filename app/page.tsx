import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import FeaturedGrid from "@/components/featured-grid"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Magical background glows */}
      <div className="pointer-events-none select-none absolute -top-32 -left-32 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.35, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 right-0 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] z-0" style={{filter: 'blur(100px)', opacity: 0.18, background: 'radial-gradient(circle, #c4b5fd 0%, #a78bfa 100%)'}} />

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200&text=Streetwear+Pattern')] opacity-5"></div>
        <div className="relative w-full flex flex-col items-center justify-center px-4 py-8 md:py-0 text-center min-h-screen">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 md:mb-10 tracking-tight">
            Sell Smart.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Sell Fast.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            AI-powered pricing helps you sell your streetwear at the perfect price, exactly when you want to sell.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 items-center">
            <Link href="/feed">
              <div className="relative group">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{width: 180, height: 72}}>
                  <div style={{width: '100%', height: '100%', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(168,85,247,0.25) 100%)', filter: 'blur(18px)'}} />
                </div>
                <Button size="lg" className="relative rounded-full bg-white text-black hover:bg-gray-100 px-8 transition-all duration-300 z-10">
                  <span className="flex items-center">Explore <ArrowRight className="ml-2 h-4 w-4" /></span>
                </Button>
              </div>
            </Link>
            <Link href="/upload">
              <div className="relative group">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{width: 180, height: 72}}>
                  <div style={{width: '100%', height: '100%', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(168,85,247,0.25) 100%)', filter: 'blur(18px)'}} />
                </div>
                <Button size="lg" variant="outline" className="relative rounded-full border-white text-white hover:bg-white hover:text-black px-8 transition-all duration-300 z-10">
                  <span>Start Selling</span>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="flex flex-col items-center justify-center py-28 bg-white w-full">
        <div className="w-full max-w-7xl px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl font-black mb-4">Trending Now</h2>
            <p className="text-gray-600 text-lg mb-8">Discover what's hot in streetwear</p>
          </div>
          <div className="pb-4">
            <FeaturedGrid />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center justify-center py-24 bg-black text-white w-full">
        <div className="w-full max-w-2xl px-4 text-center">
          <h2 className="text-4xl font-black mb-8">Ready to SWAPP?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join the smartest streetwear marketplace. Sell faster with AI pricing.
          </p>
          <Link href="/upload">
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100 px-8">
              List Your First Item
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
