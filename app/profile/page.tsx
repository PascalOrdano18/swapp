"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, Image as ImageIcon, Phone } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ soldCount: 0, activeCount: 0 })
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
    // Fetch stats
    fetch("/api/user-stats", { headers: { "user-id": user.id } })
      .then(res => res.json())
      .then(data => {
        setStats({ soldCount: data.soldCount || 0, activeCount: data.activeCount || 0 })
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

  return (
    <div className="min-h-screen py-10 mt-20 relative overflow-hidden">
      {/* Magical background glows */}
      <div className="pointer-events-none select-none absolute -top-32 left-1/4 w-[520px] h-[420px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 right-1/4 w-[520px] h-[420px] z-0" style={{filter: 'blur(90px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-300">Gestiona tu cuenta y preferencias</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
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
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <p className="text-white font-medium">{user.email || 'Sin email'}</p>
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
                  <p className="text-white/80 text-sm min-h-[24px]">{profile.full_name || <span className="text-white/40">Sin nombre</span>}</p>
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
                  <p className="text-white/80 text-sm min-h-[24px]">{profile.bio || <span className="text-white/40">Sin bio</span>}</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <label className="block text-white/60 text-sm mb-1 flex items-center gap-1"><Phone className="h-4 w-4" />Contacto</label>
                {edit ? (
                  <input
                    className="w-full bg-transparent border border-white/20 rounded-lg p-2 text-white"
                    value={profile.contact || ''}
                    onChange={e => setProfile(prev => ({ ...prev, contact: e.target.value }))}
                  />
                ) : (
                  <p className="text-white/80 text-sm min-h-[24px]">{profile.contact || <span className="text-white/40">Sin contacto</span>}</p>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {edit ? (
                  <>
                    <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
                    <Button variant="outline" onClick={() => { setEdit(false); setAvatarFile(null); }}>Cancelar</Button>
                  </>
                ) : (
                  <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => setEdit(true)}>Editar Perfil</Button>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Stats */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Estadísticas</CardTitle>
              <CardDescription className="text-white/70">
                Tu actividad en SWAPP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-white">{loading ? '...' : stats.soldCount}</p>
                  <p className="text-sm text-white/60">Artículos Vendidos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-white">{loading ? '...' : stats.activeCount}</p>
                  <p className="text-sm text-white/60">Artículos Activos</p>
                </div>
              </div>
              <Button className="w-full rounded-full bg-white text-black hover:bg-gray-200" onClick={() => router.push('/feed?mine=1')}>
                Ver Mis Artículos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 