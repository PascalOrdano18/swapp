"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, Sparkles, Loader2, Plus, Package } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState("")

  // Batch upload state
  const [uploadedItems, setUploadedItems] = useState<{id: string; title: string; price: number; brand: string; condition: string; photos: File[];}[]>([])
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [isSendingToChannel, setIsSendingToChannel] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Send to channel function
  const sendToChannel = async (itemIds: string[]) => {
    try {
      const response = await fetch('/api/send-to-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemIds }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send to channel')
      }

      const result = await response.json()
      console.log('Channel send result:', result)
    } catch (error) {
      console.error('Error sending to channel:', error)
      // Don't throw here - we don't want to block the upload process
      // Just log the error for now
    }
  }

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const fileArr = Array.from(files).slice(0, 4 - photos.length) // Ensure we don't exceed 4 photos
    setPhotos((prev) => [...prev, ...fileArr])
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

  // Reset form for next item
  const resetForm = () => {
    setPhotos([])
    setForm({
      title: "",
      brand: "",
      size: "",
      condition: "",
      description: "",
    })
    setAiPrice(null)
    setSellSpeed(50)
    setStep(1)
  }

  const handleFinalSubmit = async (addAnother: boolean = false) => {
    if (!user || photos.length === 0 || !aiPrice) {
      alert("Please complete all steps and ensure you are logged in.")
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Insert item data to get the item ID
      setSubmissionStatus("Creating item listing...")
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert({
          seller_id: user.id,
          title: form.title,
          description: form.description,
          price: aiPrice,
          brand: form.brand,
          size: form.size,
          condition: form.condition,
          status: 'active',
        })
        .select()
        .single()

      if (itemError) throw new Error(`Error creating item: ${itemError.message}`)
      const newItemId = itemData.id
      
      // 2. Upload images to storage
      setSubmissionStatus(`Uploading ${photos.length} image(s)...`)
      const uploadedImageUrls: string[] = []

      for (const photo of photos) {
        const filePath = `${user.id}/${newItemId}/${Date.now()}-${photo.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(filePath, photo)
        
        if (uploadError) throw new Error(`Error uploading image: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(filePath)
        
        uploadedImageUrls.push(urlData.publicUrl)
      }

      // 3. Insert image URLs into the item_images table
      setSubmissionStatus("Finalizing images...")
      const imageRecords = uploadedImageUrls.map((url, index) => ({
        item_id: newItemId,
        image_url: url,
        is_primary: index === 0,
      }))

      const { error: imagesError } = await supabase
        .from('item_images')
        .insert(imageRecords)

      if (imagesError) throw new Error(`Error saving images: ${imagesError.message}`)

      // 4. Send to WhatsApp channel
      setSubmissionStatus("Sending to WhatsApp channel...")
      await sendToChannel([newItemId])

      setSubmissionStatus("Success! Redirecting...")
      
      // 5. Redirect to the new item page
      router.push(`/items/${newItemId}`)

    } catch (error: any) {
      alert(error.message)
      setIsSubmitting(false)
      setSubmissionStatus("")
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white flex-col gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-violet-400" />
        <p className="text-lg font-semibold">{submissionStatus}</p>
        <p className="text-sm text-white/70">Please wait, do not close this window.</p>
      </div>
    )
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
                    <img src={URL.createObjectURL(photos[i])} alt="preview" className="object-cover w-full h-full" />
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
            <Button className="w-1/2 rounded-full h-11 text-base font-semibold bg-white text-black hover:bg-gray-200" onClick={() => setStep(3)}>
              Next: Pricing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Pricing
  if (step === 3) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Magical background glows */}
        <div className="pointer-events-none select-none absolute -top-32 -left-32 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.35, background: 'radial-gradient(circle, #a78bfa 0%, #6366f1 100%)'}} />
        <div className="pointer-events-none select-none absolute bottom-0 right-0 w-[420px] h-[320px] z-0" style={{filter: 'blur(80px)', opacity: 0.25, background: 'radial-gradient(circle, #818cf8 0%, #a21caf 100%)'}} />

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 relative flex flex-col">
          <ProgressBar step={3} />
          <h1 className="text-2xl font-bold text-center mb-1 text-white">Fijación de Precios</h1>
          <p className="text-white/70 text-center mb-6">Elige tu estrategia de venta.</p>

          <Card className="bg-white/5 border-white/20 p-4 text-center mb-6">
            <CardTitle className="text-base text-white/80 font-semibold mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              <span>Sugerencia de la IA</span>
            </CardTitle>
            {isGenerating ? (
              <div className="h-10 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/70" />
              </div>
            ) : aiPrice ? (
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">${aiPrice}</p>
            ) : (
              <Button onClick={generatePrice} variant="ghost" className="text-white/80 hover:text-white">Generar Precio</Button>
            )}
          </Card>

          <div className="space-y-4 mb-6">
            <Label className="text-white/80 font-semibold text-sm">Velocidad de venta</Label>
            <Slider
              value={[sellSpeed]}
              onValueChange={(v) => setSellSpeed(v[0])}
              className="my-4"
              onPointerUp={generatePrice}
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>Venta Rápida (Precio Bajo)</span>
              <span>Venta Lenta (Precio Alto)</span>
            </div>
          </div>
          
          <div className="mt-auto pt-4 flex gap-2">
            <Button variant="outline" className="rounded-full h-11 w-1/2 bg-transparent border-white/20 text-white hover:bg-white/10" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button 
              className="w-1/2 rounded-full h-11 text-base font-semibold bg-white text-black hover:bg-gray-200" 
              onClick={() => handleFinalSubmit(false)}
              disabled={!aiPrice || isSubmitting}
            >
              List Item
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Fallback, should not be reached
  return null
}
