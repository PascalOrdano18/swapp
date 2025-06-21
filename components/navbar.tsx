"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, User, ArrowRight, LogOut, Settings } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string }>>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      // Fetch real search results from the API
      const controller = new AbortController()
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          setSearchResults(Array.isArray(data) ? data : [])
        })
        .catch(() => setSearchResults([]))
      return () => controller.abort()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSearchClick = () => {
    setIsSearchActive(true)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchActive(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const firstResult = searchResults[0]
      if (firstResult) {
        router.push(`/items/${firstResult.id}`)
      }
    }
  }

  const handleResultClick = (itemId: string) => {
    router.push(`/items/${itemId}`)
    setIsSearchActive(false)
    setSearchQuery("")
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <>
      {/* Backdrop blur overlay when search is active */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-500",
          isSearchActive ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsSearchActive(false)}
      />

      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-700 ease-out backdrop-blur-xl border-b border-violet-200/40 bg-transparent",
          isScrolled ? "" : "",
        )}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative z-10 flex items-center">
              <span className="relative flex items-center">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" style={{width: 120, height: 56}}>
                  <span style={{width: '100%', height: '100%', borderRadius: 56, background: 'radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(168,85,247,0.35) 100%)', filter: 'blur(24px)'}} />
                </span>
                <Image src="/logo.png" alt="Swapp Logo" width={100} height={40} className="transition-all duration-300 group-hover:scale-105" />
              </span>
            </Link>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl mx-12 z-30">
              {/* Magical Glow */}
              {isSearchActive && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" style={{width: 520, height: 120}}>
                  <div style={{width: '100%', height: '100%', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(168,85,247,0.15) 100%)', filter: 'blur(32px)'}} />
                </div>
              )}
              <form onSubmit={handleSearchSubmit} className="relative z-30">
                <div
                  className={cn(
                    "relative overflow-visible transition-all duration-500 ease-out z-30",
                    isSearchActive ? "scale-105" : "scale-100",
                  )}
                >
                  {/* Search Container */}
                  <div
                    className={cn(
                      "relative flex items-center w-full rounded-full transition-all duration-500 ease-out cursor-pointer z-30 bg-white px-4 py-2 gap-2 shadow-md border border-violet-100",
                      isSearchActive
                        ? "shadow-xl border-violet-200"
                        : "hover:shadow-lg hover:border-violet-200",
                    )}
                    onClick={!isSearchActive ? handleSearchClick : undefined}
                    style={{border: 'none'}}
                  >
                    {/* Search Icon */}
                    <div className="flex items-center justify-center w-8 h-8">
                      <Search
                        className={cn(
                          "transition-all duration-500 ease-out text-violet-400",
                          isSearchActive ? "h-5 w-5 text-violet-600" : "h-4 w-4"
                        )}
                      />
                    </div>
                    {/* Search Input */}
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder={isSearchActive ? "Search for streetwear, brands, or styles..." : "Search"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={handleSearchBlur}
                      className={cn(
                        "flex-1 bg-white text-violet-900 border-none outline-none shadow-none px-0 py-0 h-10 text-base md:text-sm rounded-none focus:outline-none focus:ring-0 placeholder:text-violet-400",
                        isSearchActive ? "pr-16" : "pr-4 cursor-pointer"
                      )}
                      readOnly={!isSearchActive}
                    />
                    {/* Search Submit Button */}
                    <button
                      type="submit"
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white text-violet-700 transition-all duration-500 ease-out outline-none focus:outline-none focus:ring-0 shadow border border-violet-100",
                        isSearchActive && searchQuery ? "w-8 h-8 opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-0",
                      )}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Search Suggestions */}
                  {isSearchActive && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-gradient-to-br from-white via-violet-50 to-white rounded-2xl border border-violet-100 shadow-2xl shadow-violet-300/30 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-300 z-50 overflow-visible">
                      <div className="p-6">
                        {searchQuery.trim() ? (
                          <div className="mb-4">
                            <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-3">
                              Search Results
                            </p>
                            <div className="space-y-1">
                              {searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                  <button
                                    key={result.id}
                                    className="group flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-violet-50 hover:shadow-md hover:shadow-violet-200/40"
                                    onClick={() => handleResultClick(result.id)}
                                  >
                                    <Search className="h-4 w-4 text-violet-400 mr-3 group-hover:text-violet-600 transition-colors" />
                                    <span className="text-sm text-black/80 group-hover:text-violet-700 font-medium transition-colors">
                                      {result.title}
                                    </span>
                                  </button>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 px-3 py-2">No results found</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-3">
                              Trending Searches
                            </p>
                            <div className="space-y-1">
                              {[
                                "Supreme Box Logo",
                                "Jordan 1 Chicago",
                                "Bape Shark Hoodie",
                                "Off-White Belt",
                                "Travis Scott Jordan",
                              ].map((suggestion, index) => (
                                <button
                                  key={suggestion}
                                  className="group flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-violet-50 hover:shadow-md hover:shadow-violet-200/40"
                                  onClick={() => {
                                    setSearchQuery(suggestion)
                                    searchInputRef.current?.focus()
                                  }}
                                >
                                  <Search className="h-4 w-4 text-violet-400 mr-3 group-hover:text-violet-600 transition-colors" />
                                  <span className="text-sm text-black/80 group-hover:text-violet-700 font-medium transition-colors">
                                    {suggestion}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Sell Button */}
              <Link href="/upload">
                <Button
                  size="sm"
                  className="group relative overflow-hidden rounded-full bg-white text-violet-900 hover:bg-violet-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-200/40 px-6 h-10 border border-violet-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-violet-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Plus className="h-4 w-4 mr-2 relative z-10 transition-transform duration-300 group-hover:rotate-180 text-violet-700" />
                  <span className="relative z-10 font-medium text-sm">Vender</span>
                </Button>
              </Link>

              {/* Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="group relative rounded-full w-10 h-10 bg-white text-violet-700 hover:bg-violet-50 transition-all duration-300 hover:scale-110 border border-violet-100"
                    >
                      <User className="h-5 w-5 text-violet-400 transition-all duration-300 group-hover:text-violet-700 group-hover:scale-110" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-100/40 to-violet-200/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border border-violet-100">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-violet-900">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Mi Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group relative rounded-full bg-white text-violet-700 hover:bg-violet-50 transition-all duration-300 hover:scale-105 border border-violet-100 px-4"
                  >
                    <span className="font-medium text-sm">Iniciar Sesión</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent transition-opacity duration-500",
            isScrolled ? "opacity-100" : "opacity-0",
          )}
        />
      </header>
    </>
  )
}
