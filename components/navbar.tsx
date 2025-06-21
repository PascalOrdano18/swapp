"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Search, Plus, User, LogOut, Settings } from "lucide-react"
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
import PrimaryButton from "@/components/PrimaryButton"

export default function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string }>>([])
  const [trendingItems, setTrendingItems] = useState<Array<{ id: string; title: string }>>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/trending-items')
        const data = await response.json()
        if (Array.isArray(data)) {
          setTrendingItems(data)
        }
      } catch (error) {
        console.error('Failed to fetch trending items', error)
      }
    }
    fetchTrending()
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
        setIsSearchActive(false)
        setSearchQuery("")
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
        {/* Decorative Glow */}
        <div 
          className="pointer-events-none absolute left-0 top-0 w-full h-full opacity-50"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168, 85, 247, 0.15), transparent 80%)',
          }} 
        />
        
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative z-10 flex items-center">
              <span className="relative flex items-center">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" style={{width: 120, height: 56}}>
                  <span style={{width: '100%', height: '100%', borderRadius: 56, background: 'radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(168,85,247,0.35) 100%)', filter: 'blur(24px)'}} />
                </span>
                <Image src="/logo.png" alt="Swapp Logo" width={100} height={40} className="transition-all duration-300 group-hover:scale-105" />
              </span>
            </Link>

            {/* Search Bar - Revised */}
            <div className="group relative flex-1 max-w-xl mx-12 z-30">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 blur",
                  isSearchActive ? "opacity-60" : "opacity-0 group-hover:opacity-40"
                )}
              />
              <form onSubmit={handleSearchSubmit} className="relative z-10">
                <div
                  className={cn(
                    "relative transition-all duration-300 ease-out",
                    isSearchActive ? "scale-105" : "scale-100"
                  )}
                >
                  <div
                    className="relative flex items-center w-full rounded-full bg-black/80 backdrop-blur-sm border border-white/10"
                    onClick={!isSearchActive ? handleSearchClick : undefined}
                  >
                    <div className="pl-4 pr-2 py-2 flex items-center justify-center">
                      <Search className="h-5 w-5 text-purple-300" />
                    </div>
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder={isSearchActive ? "Search for anything..." : "Search"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={handleSearchBlur}
                      className="flex-1 bg-transparent text-white border-none outline-none shadow-none p-0 h-10 text-base placeholder:text-white/40 cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0"
                      readOnly={!isSearchActive}
                    />
                  </div>

                  {isSearchActive && (
                    <div 
                      className="absolute top-full left-0 right-0 mt-3 bg-black/80 border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 backdrop-blur-xl animate-in slide-in-from-top-2 duration-300 z-50 overflow-hidden"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="p-2">
                        {searchQuery.trim() ? (
                          <div>
                            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1 px-3 pt-2">
                              Search Results
                            </p>
                            <div className="space-y-1 p-1">
                              {searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                  <button
                                    key={result.id}
                                    type="button"
                                    className="group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/10"
                                    onClick={() => handleResultClick(result.id)}
                                  >
                                    <Search className="h-4 w-4 text-purple-400 mr-3 group-hover:text-purple-300 transition-colors" />
                                    <span className="text-sm text-white/80 group-hover:text-white font-medium transition-colors">
                                      {result.title}
                                    </span>
                                  </button>
                                ))
                              ) : (
                                <p className="text-sm text-white/50 px-3 py-2">No results found.</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1 px-3 pt-2">
                              Latest Items
                            </p>
                            <div className="space-y-1 p-1">
                              {trendingItems.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  className="group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/10"
                                  onClick={() => handleResultClick(item.id)}
                                >
                                  <Search className="h-4 w-4 text-purple-400 mr-3 group-hover:text-purple-300 transition-colors" />
                                  <span className="text-sm text-white/80 group-hover:text-white font-medium transition-colors">
                                    {item.title}
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
            <div className="flex items-center gap-4">
              {/* Sell Button */}
              <Link href="/upload">
                <PrimaryButton size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Vender
                </PrimaryButton>
              </Link>

              {/* Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="group relative rounded-full w-10 h-10 bg-white text-violet-700 hover:bg-violet-50 transition-all duration-300 hover:scale-110 border border-violet-100"
                    >
                      <div 
                        className="absolute -inset-2 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(139, 92, 246, 0.3) 100%)',
                          filter: 'blur(12px)'
                        }}
                      />
                      <User className="relative z-10 h-5 w-5 mx-auto text-violet-400 transition-all duration-300 group-hover:text-violet-700 group-hover:scale-110" />
                    </button>
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
                  <PrimaryButton size="sm">
                    Iniciar Sesión
                  </PrimaryButton>
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
