import { Suspense } from "react"
import FeedFilters from "@/components/feed-filters"
import FeedGrid from "@/components/feed-grid"

type FeedPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function FeedPage({ searchParams }: FeedPageProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white mb-3">Discover</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">Find your next favorite piece from our community-curated collection of streetwear.</p>
        </header>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4 w-full">
            <div className="sticky top-28 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <FeedFilters />
            </div>
          </aside>
          
          {/* Feed Grid */}
          <section className="flex-1">
            <Suspense fallback={<div className="text-center text-white/50 py-10">Loading items...</div>}>
              <FeedGrid searchParams={searchParams} />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}
