"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, Sparkles } from "lucide-react"
import { Slider } from "@/components/ui/slider"

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-2 w-16 rounded-full transition-all duration-300 ${
            step >= s ? "bg-blue-600" : "bg-neutral-200"
          }`}
        />
      ))}
    </div>
  )
}

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<(string | ArrayBuffer | null)[]>([])
  const [form, setForm] = useState({
    title: "",
    brand: "",
    size: "",
    condition: "",
    description: "",
  })
  const [sellSpeed, setSellSpeed] = useState(50)
  const [aiPrice, setAiPrice] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const fileArr = Array.from(files)
    fileArr.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos((prev) => [...prev, ev.target?.result || null].slice(0, 4))
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove photo
  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  // Handle select change
  const handleSelect = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  // AI Price Generation
  const generatePrice = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const basePrice = Math.floor(Math.random() * 300) + 100
      const speedMultiplier = sellSpeed / 50
      setAiPrice(Math.round(basePrice * speedMultiplier))
      setIsGenerating(false)
    }, 1500)
  }

  // Step 1: Photos
  if (step === 1) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Magical background glows */}
        <div className="pointer-events-none select-none absolute -top-32 -left-32 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.35, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
        <div className="pointer-events-none select-none absolute bottom-0 right-0 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />
        
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 relative flex flex-col">
          <ProgressBar step={1} />
          <h1 className="text-2xl font-bold text-center mb-1 text-white">Subir Fotos</h1>
          <p className="text-white/70 text-center mb-4">Agrega hasta 4 fotos de tu artículo</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                {photos[i] ? (
                  <>
                    <img src={photos[i] as string} alt="preview" className="object-cover w-full h-full" />
                    <button
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-xs text-white hover:bg-black"
                      onClick={() => removePhoto(i)}
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <button
                    className="flex flex-col items-center justify-center w-full h-full text-white/50 hover:text-white transition"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </button>
                )}
              </div>
            ))}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
              disabled={photos.length >= 4}
            />
          </div>
          <div className="mt-auto pt-4">
            <Button
              className="w-full rounded-full h-11 text-base font-semibold bg-white text-black hover:bg-gray-200"
              disabled={photos.length === 0}
              onClick={() => setStep(2)}
            >
              Next: Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Details
  if (step === 2) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Magical background glows */}
        <div className="pointer-events-none select-none absolute -top-32 -left-32 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.35, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
        <div className="pointer-events-none select-none absolute bottom-0 right-0 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 relative flex flex-col">
          <ProgressBar step={2} />
          <h1 className="text-2xl font-bold text-center mb-1 text-white">Detalles del Artículo</h1>
          <p className="text-white/70 text-center mb-4">Rellena los detalles sobre tu artículo</p>
          <form className="space-y-4 mb-4">
            <div>
              <Label htmlFor="title" className="text-white/80 font-semibold mb-1 text-sm">Título</Label>
              <Input id="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Supreme Box Logo Hoodie" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand" className="text-white/80 font-semibold mb-1 text-sm">Marca</Label>
                <Select onValueChange={(v) => handleSelect("brand", v)}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supreme">Supreme</SelectItem>
                    <SelectItem value="nike">Nike</SelectItem>
                    <SelectItem value="adidas">Adidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size" className="text-white/80 font-semibold mb-1 text-sm">Tamaño</Label>
                <Input id="size" value={form.size} onChange={handleFormChange} placeholder="e.g. L" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
              </div>
            </div>
            <div>
              <Label htmlFor="condition" className="text-white/80 font-semibold mb-1 text-sm">Condición</Label>
              <Select onValueChange={(v) => handleSelect("condition", v)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="like-new">Como Nuevo</SelectItem>
                  <SelectItem value="good">Bueno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="text-white/80 font-semibold mb-1 text-sm">Descripción</Label>
              <Textarea id="description" value={form.description} onChange={handleFormChange} placeholder="Describe tu artículo..." className="bg-white/5 border-white/20 min-h-[80px] resize-none text-white placeholder:text-white/40" />
            </div>
          </form>
          <div className="mt-auto pt-4 flex gap-2">
            <Button variant="outline" className="rounded-full h-11 w-1/2 bg-transparent border-white/20 text-white hover:bg-white/10" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              className="rounded-full h-11 w-1/2 text-base font-semibold bg-white text-black hover:bg-gray-200"
              disabled={!form.title || !form.brand || !form.size || !form.condition}
              onClick={() => setStep(3)}
            >
              Next: Pricing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Pricing
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Magical background glows */}
        <div className="pointer-events-none select-none absolute -top-32 -left-32 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.35, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
        <div className="pointer-events-none select-none absolute bottom-0 right-0 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 relative flex flex-col">
        <ProgressBar step={3} />
        <h1 className="text-2xl font-bold text-center mb-1 text-white">Establece tu Precio</h1>
        <p className="text-white/70 text-center mb-6">Elige tu velocidad de venta y obtén una sugerencia de precio con IA</p>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-white/80 font-semibold text-sm">Velocidad de Venta</Label>
            <span className="text-xs text-blue-400 font-medium">
              {sellSpeed < 33 ? "Venta Rápida" : sellSpeed < 66 ? "Equilibrado" : "Valor Máximo"}
            </span>
          </div>
          <Slider
            value={[sellSpeed]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setSellSpeed(value[0])}
            className="py-3"
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Vender Rápido</span>
            <span>Valor Máximo</span>
          </div>
        </div>
        {/* AI Price Recommendation */}
        <div className="mb-6">
          {!aiPrice && !isGenerating && (
            <div className="text-center">
              <Button
                onClick={generatePrice}
                className="rounded-full bg-blue-600 hover:bg-blue-700 h-11 px-8 text-base font-semibold text-white"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Obtener Precio con IA
              </Button>
            </div>
          )}
          {isGenerating && (
            <div className="text-center animate-pulse">
              <Sparkles className="mx-auto h-8 w-8 text-blue-400 mb-2" />
              <div className="text-white/60">Analizando datos del mercado...</div>
            </div>
          )}
          {aiPrice && (
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="h-8 w-8 text-green-400 mb-1" />
              <div className="text-3xl font-black text-white">${aiPrice}</div>
              <div className="text-white/60 text-sm mb-2">Precio recomendado por IA</div>
            </div>
          )}
        </div>
        <div className="mt-auto pt-4 flex gap-2">
          <Button variant="outline" className="rounded-full h-11 w-1/2 bg-transparent border-white/20 text-white hover:bg-white/10" onClick={() => setStep(2)}>
            Atrás
          </Button>
          <Button
            className="rounded-full h-11 w-1/2 text-base font-semibold bg-white text-black hover:bg-gray-200"
            disabled={!aiPrice}
            onClick={() => alert("¡Anuncio publicado!")}
          >
            Publicar Anuncio
          </Button>
        </div>
      </div>
    </div>
  )
}
