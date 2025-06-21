"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return null // This should be handled by middleware, but just in case
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Mail className="h-4 w-4 text-violet-400" />
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
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
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-sm text-white/60">Artículos Vendidos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-sm text-white/60">Artículos Activos</p>
                </div>
              </div>
              <Button className="w-full rounded-full bg-white text-black hover:bg-gray-200">
                Ver Mis Artículos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 