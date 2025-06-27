import { Card, CardContent } from "@/components/ui/card"
import { Package, TrendingUp, DollarSign, BarChart3 } from "lucide-react"

type UserStats = {
  soldCount: number
  activeCount: number
  totalSalesValue: number
  statusBreakdown: Record<string, number>
}

interface UserStatsCardsProps {
  stats: UserStats
  loading: boolean
}

export function UserStatsCards({ stats, loading }: UserStatsCardsProps) {
  const totalArticles = stats.activeCount + stats.soldCount + (stats.statusBreakdown?.pending || 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <Package className="h-8 w-8 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{loading ? '...' : stats.activeCount}</p>
            <p className="text-sm text-white/60">Activos</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">{loading ? '...' : stats.soldCount}</p>
            <p className="text-sm text-white/60">Vendidos</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <DollarSign className="h-8 w-8 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">${loading ? '...' : stats.totalSalesValue.toLocaleString()}</p>
            <p className="text-sm text-white/60">Total Ventas</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{loading ? '...' : totalArticles}</p>
            <p className="text-sm text-white/60">Total de Artículos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 