import { Suspense } from "react"
import FeedFilters from "@/components/feed-filters"

export default function FeedPage() {
  return (
    <main className="min-h-screen py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Discover</h1>
          <p className="text-lg text-gray-300">Find your next streetwear piece</p>
        </header>
        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4 w-full mb-6 lg:mb-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sticky top-8">
              <FeedFilters />
            </div>
          </aside>
          {/* Feed Grid */}
          <section className="flex-1">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
              <FeedGrid />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}
