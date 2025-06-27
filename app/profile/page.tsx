"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PrimaryButton from "@/components/PrimaryButton"
import { UserStatsCards } from "@/components/user-stats-cards"
import { User, Mail, Calendar, Image as ImageIcon, Phone, TrendingUp, DollarSign, Package, Clock, BarChart3 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

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

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats>({
    soldCount: 0,
    activeCount: 0,
    totalSalesValue: 0,
    averagePrice: 0,
    recentItems: [],
    topItems: [],
    statusBreakdown: {}
  })
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({ full_name: '', contact: '', avatar_url: '', bio: '' })
  const [edit, setEdit] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null)

  // Fetch profile info
  useEffect(() => {
    if (!user) return
    setLoading(true)
    // Fetch enhanced stats
    fetch("/api/user-stats", { headers: { "user-id": user.id } })
      .then(res => res.json())
      .then(data => {
        setStats(data)
      })
      .catch(error => {
        console.error('Error fetching stats:', error)
      })
    // Fetch profile
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, contact, avatar_url, bio')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  if (!user) return null

  // Handle avatar file select
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
      setLocalAvatarPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  // Save profile changes
  const handleSave = async () => {
    setSaving(true)
    let avatar_url = profile.avatar_url
    // If avatar file changed, upload to Supabase Storage 'avatars' bucket
    if (avatarFile) {
      const supabase = createClient()
      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${user.id}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
        avatar_url = data.publicUrl
      }
    }
    // Get access token
    const supabase = createClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token
    // Update profile via API
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({
        full_name: profile.full_name,
        contact: profile.contact,
        avatar_url,
        bio: profile.bio
      })
    })
    // Re-fetch profile from DB to ensure UI is up to date
    const { data } = await supabase
      .from('profiles')
      .select('full_name, contact, avatar_url, bio')
      .eq('id', user.id)
      .single()
    if (data) setProfile(data)
    setSaving(false)
    setEdit(false)
    setAvatarFile(null)
    setLocalAvatarPreview(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Activo</Badge>
      case 'sold':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Vendido</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Pendiente</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen py-10 mt-20 relative overflow-hidden">
      {/* Magical background glows */}
      <div className="pointer-events-none select-none absolute -top-32 left-1/4 w-[520px] h-[420px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 right-1/4 w-[520px] h-[420px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-300">Gestiona tu cuenta y preferencias</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription className="text-white/70">
                Detalles de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={edit && localAvatarPreview ? localAvatarPreview : (profile.avatar_url || "/placeholder.svg?height=100&width=100") } alt="Avatar" />
                    <AvatarFallback>{user.email ? user.email[0] : '?'}</AvatarFallback>
                  </Avatar>
                  {edit && (
                    <button
                      className="absolute bottom-0 right-0 bg-violet-600 text-white rounded-full p-1 hover:bg-violet-700"
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/60">Email</p>
                  <p className="text-white font-medium truncate text-sm" title={user.email || 'Sin email'}>{user.email || 'Sin email'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Calendar className="h-4 w-4 text-violet-400" />
                <div>
                  <p className="text-sm text-white/60">Miembro desde</p>
                  <p className="text-white font-medium">
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <label className="block text-white/60 text-sm mb-1">Nombre completo</label>
                {edit ? (
                  <input
                    className="w-full bg-transparent border border-white/20 rounded-lg p-2 text-white"
                    value={profile.full_name || ''}
                    onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                ) : (
                  <p className="text-white/80 text-sm min-h-[24px] truncate max-w-[240px]" title={profile.full_name}>{profile.full_name || <span className="text-white/40">Sin nombre</span>}</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <label className="block text-white/60 text-sm mb-1">Bio</label>
                {edit ? (
                  <textarea
                    className="w-full bg-transparent border border-white/20 rounded-lg p-2 text-white min-h-[40px]"
                    value={profile.bio || ''}
                    onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  />
                ) : (
                  <p className="text-white/80 text-sm min-h-[24px] truncate max-w-[240px]" title={profile.bio}>{profile.bio || <span className="text-white/40">Sin bio</span>}</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <label className="block text-white/60 text-sm mb-1 flex items-center gap-1"><Phone className="h-4 w-4" />Contacto</label>
                {edit ? (
                  <div>
                    <input
                      className="w-full bg-transparent border border-white/20 rounded-lg p-2 text-white"
                      value={profile.contact || ''}
                      onChange={e => setProfile(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="+54 11 15-2521-7102"
                    />
                    <p className="text-xs text-white/50 mt-1">Ejemplo: +54 11 15-9999-9999</p>
                  </div>
                ) : (
                  <p className="text-white/80 text-sm min-h-[24px] truncate max-w-[240px]" title={profile.contact}>{profile.contact || <span className="text-white/40">Sin contacto</span>}</p>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {edit ? (
                  <>
                    <PrimaryButton onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</PrimaryButton>
                    <Button variant="outline" onClick={() => { setEdit(false); setAvatarFile(null); }}>Cancelar</Button>
                  </>
                ) : (
                  <PrimaryButton onClick={() => setEdit(true)}>Editar Perfil</PrimaryButton>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Stats and Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Stats */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estadísticas Principales
                </CardTitle>
                <CardDescription className="text-white/70">
                  Tu actividad en SWAPP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserStatsCards stats={stats} loading={loading} />
                <div className="mt-4">
                  <PrimaryButton 
                    className="w-full" 
                    onClick={() => router.push('/profile/my-items')}
                  >
                    Gestionar Mis Artículos
                  </PrimaryButton>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription className="text-white/70">
                  Tus últimos artículos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSpinner size={24} text="Cargando actividad..." />
                ) : stats.recentItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Aún no tienes artículos</p>
                    <PrimaryButton 
                      className="mt-4"
                      onClick={() => router.push('/upload')}
                    >
                      Subir Primer Artículo
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex-1">
                          <p className="text-white font-medium truncate">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-white/60">
                              {new Date(item.created_at).toLocaleDateString('es-ES')}
                            </span>
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performing Items */}
            {stats.topItems.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Artículos Destacados
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Tus artículos con mayor valor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium truncate">{item.title}</p>
                          <p className="text-sm text-white/60">Artículo activo</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 