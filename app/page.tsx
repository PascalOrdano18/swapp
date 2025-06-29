import Link from "next/link"
import { ArrowRight } from "lucide-react"
import FeaturedGrid from "@/components/featured-grid"
import PrimaryButton from "@/components/PrimaryButton"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function Home() {
  // Generate random positions for glowing balls on every render
  const glowBalls = [
    {
      size: 192,
      color: 'radial-gradient(circle, #60a5fa 0%, #818cf8 100%)',
      opacity: 0.28,
      blur: 36,
      animationDelay: 0,
    },
    {
      size: 160,
      color: 'radial-gradient(circle, #a78bfa 0%, #c084fc 100%)',
      opacity: 0.22,
      blur: 32,
      animationDelay: 2,
    },
    {
      size: 128,
      color: 'radial-gradient(circle, #f472b6 0%, #a21caf 100%)',
      opacity: 0.18,
      blur: 24,
      animationDelay: 1,
    },
    {
      size: 144,
      color: 'radial-gradient(circle, #fbbf24 0%, #f472b6 100%)',
      opacity: 0.20,
      blur: 30,
      animationDelay: 3,
    },
  ].map(ball => ({
    ...ball,
    top: Math.random() * 50 + 15, // 15% to 65%
    left: Math.random() * 40 + 20, // 20% to 60%
  }))

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black" style={{}}>
      {/* Magical background glows */}
      <div className="pointer-events-none select-none absolute -top-32 -left-32 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.35, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 right-0 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />
      <div className="pointer-events-none select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] z-0" style={{filter: 'blur(100px)', opacity: 0.18, background: 'radial-gradient(circle, #c4b5fd 0%, #a78bfa 100%)'}} />

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-screen bg-black">
        {/* Glowing balls inside hero section, behind content */}
        {glowBalls.map((ball, i) => (
          <div
            key={i}
            className="pointer-events-none select-none absolute z-0 animate-float"
            style={{
              top: `${ball.top}%`,
              left: `${ball.left}%`,
              width: ball.size,
              height: ball.size,
              filter: `blur(${ball.blur}px)`,
              opacity: ball.opacity,
              background: ball.color,
              animationDelay: `${ball.animationDelay}s`,
            }}
          />
        ))}

        <div className="relative w-full flex flex-col items-center justify-center px-4 py-8 md:py-0 text-center min-h-screen z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 md:mb-10 tracking-tight">
            Compra Inteligente.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Vende Rápido.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            La fijación de precios con IA te ayuda a vender tu streetwear al precio perfecto, exactamente cuando quieres vender.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 items-center">
            <Link href="/feed">
              <PrimaryButton>
                <span className="flex items-center">Explorar<ArrowRight className="ml-2 h-4 w-4" /></span>
              </PrimaryButton>
            </Link>
            <Link href="/upload">
              <PrimaryButton>
                Vender
              </PrimaryButton>
            </Link>
                    </div>
        </div>
      </section>

      {/* Black background for Trending and CTA */}
      <div className="w-full bg-black">
        {/* Featured Items */}
        <section className="relative flex flex-col items-center justify-center py-32 w-full min-h-[60vh] overflow-visible bg-black">
          <div className="w-full max-w-7xl px-4 relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-5xl font-black mb-3 tracking-tight text-white">Tendencias</h2>
              <p className="text-gray-400 text-lg mb-2">Descubre lo más popular en streetwear</p>
            </div>
            <FeaturedGrid />
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex flex-col items-center justify-center py-24 w-full bg-black">
          <div className="w-full max-w-2xl px-4 text-center">
            <h2 className="text-4xl font-black mb-8 text-white">Ready to SWAPP?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Únete al marketplace de streetwear más inteligente. Vende más rápido con precios de IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/upload">
                <PrimaryButton>
                  Lista tu Primer Artículo
                </PrimaryButton>
              </Link>
              <WhatsAppButton 
                whatsappUrl="https://chat.whatsapp.com/YOUR_ACTUAL_CHANNEL_INVITE_LINK"
                size="lg"
              >
                Comunidad
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
