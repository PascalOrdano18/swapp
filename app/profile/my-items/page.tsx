"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PrimaryButton from "@/components/PrimaryButton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { UserStatsCards } from "@/components/user-stats-cards"
import { 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"

type Item = {
  id: string
  title: string
  price: number
  status: string
  created_at: string
  brand?: string
  condition?: string
  image?: string
}

type UserStats = {
  soldCount: number
  activeCount: number
  totalSalesValue: number
  averagePrice: number
  recentItems: Array<{
    id: string
    title: string
    price: number
    status: string
    created_at: string
  }>
  topItems: Array<{
    id: string
    title: string
    price: number
    status: string
  }>
  statusBreakdown: Record<string, number>
}

export default function MyItemsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [stats, setStats] = useState<UserStats>({
    soldCount: 0,
    activeCount: 0,
    totalSalesValue: 0,
    averagePrice: 0,
    recentItems: [],
    topItems: [],
    statusBreakdown: {}
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user) return
    fetchItems()
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    if (!user) return
    
    try {
      const response = await fetch("/api/user-stats", { headers: { "user-id": user.id } })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchItems = async () => {
    if (!user) return
    setLoading(true)
    
    const supabase = createClient()
    const { data, error } = await supabase
      .from('items')
      .select(`
        id,
        title,
        price,
        status,
        created_at,
        brand,
        condition,
        item_images (
          image_url,
          is_primary
        )
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching items:', error)
      setLoading(false)
      return
    }

    // Process items to include primary image
    const processedItems = data.map(item => {
      const primaryImage = item.item_images?.find(img => img.is_primary)?.image_url || 
                          item.item_images?.[0]?.image_url
      return {
        ...item,
        image: primaryImage || "/placeholder.svg?height=400&width=300"
      }
    })

    setItems(processedItems)
    setLoading(false)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || item.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>
      case 'sold':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Vendido</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
    
    if (error) {
      alert('Error al eliminar el artículo')
      return
    }
    
    fetchItems()
    fetchStats() // Refresh stats after deletion
  }

  const handleMarkAsSold = async (itemId: string) => {
    if (!user) {
      alert('Debes estar autenticado para realizar esta acción')
      return
    }
    
    if (!confirm('¿Estás seguro de que quieres marcar este artículo como vendido?')) return
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('items')
        .update({ status: 'sold' })
        .eq('id', itemId)
        .eq('seller_id', user.id) // Ensure user can only update their own items
        .select()
      
      if (error) {
        console.error('Supabase error:', error)
        alert(`Error al marcar el artículo como vendido: ${error.message}`)
        return
      }
      
      if (!data || data.length === 0) {
        alert('No se pudo encontrar el artículo o no tienes permisos para modificarlo')
        return
      }
      
      console.log('Item successfully marked as sold:', data)
      fetchItems()
      fetchStats() // Refresh stats after update
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Error inesperado al marcar el artículo como vendido')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen py-10 mt-20 relative overflow-hidden">
      {/* Magical background glows */}
      <div className="pointer-events-none select-none absolute -top-32 left-1/4 w-[520px] h-[420px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 right-1/4 w-[520px] h-[420px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mis Artículos</h1>
            <p className="text-gray-300">Gestiona tus productos en venta</p>
          </div>
          <PrimaryButton 
            onClick={() => router.push('/upload')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Subir Nuevo Artículo
          </PrimaryButton>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <UserStatsCards stats={stats} loading={loading} />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-xl border border-white/10">
            <TabsTrigger value="all" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Todos ({items.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Activos ({items.filter(i => i.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="sold" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Vendidos ({items.filter(i => i.status === 'sold').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <LoadingSpinner size={32} text="Cargando artículos..." />
            ) : filteredItems.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No hay artículos</h3>
                  <p className="text-white/60 mb-4">
                    {activeTab === "all" 
                      ? "Aún no has subido ningún artículo"
                      : `No tienes artículos ${activeTab === "active" ? "activos" : activeTab === "sold" ? "vendidos" : "pendientes"}`
                    }
                  </p>
                  <PrimaryButton 
                    onClick={() => router.push('/upload')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Subir Primer Artículo
                  </PrimaryButton>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg?height=400&width=300"}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          ${item.price}
                        </span>
                        <div className="flex items-center text-white/60 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(item.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.brand && (
                          <Badge variant="outline" className="text-white/80 border-white/20">
                            {item.brand}
                          </Badge>
                        )}
                        {item.condition && (
                          <Badge variant="outline" className="text-white/80 border-white/20">
                            {item.condition}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="flex-1 bg-white text-black hover:bg-gray-100"
                          onClick={() => router.push(`/items/${item.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        {item.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                            onClick={() => handleMarkAsSold(item.id)}
                            title="Marcar como vendido"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-white/20 text-slate-400 hover:bg-white/10 hover:text-slate-300"
                          onClick={() => router.push(`/upload?edit=${item.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 