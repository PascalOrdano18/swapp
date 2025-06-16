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
      <div className="min-h-screen flex justify-center bg-neutral-100 px-2">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-10 relative flex flex-col mt-24">
          <ProgressBar step={1} />
          <h1 className="text-2xl font-bold text-center mb-2 text-black">Upload Photos</h1>
          <p className="text-black text-center mb-6">Add up to 4 photos of your item</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                {photos[i] ? (
                  <>
                    <img src={photos[i] as string} alt="preview" className="object-cover w-full h-full" />
                    <button
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs text-red-500 hover:bg-white"
                      onClick={() => removePhoto(i)}
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <button
                    className="flex flex-col items-center justify-center w-full h-full text-neutral-500 hover:text-blue-600 transition"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <Upload className="h-7 w-7 mb-1" />
                    <span className="text-xs text-black">Add Photo</span>
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
          <div className="sticky bottom-0 left-0 w-full bg-white pt-4 pb-2 flex justify-end">
            <Button
              className="w-full rounded-full h-11 text-base font-semibold"
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-2 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-10 relative flex flex-col mt-24">
          <ProgressBar step={2} />
          <h1 className="text-2xl font-bold text-center mb-2 text-black">Item Details</h1>
          <p className="text-black text-center mb-6">Fill in the details about your item</p>
          <form className="space-y-5 mb-8">
            <div>
              <Label htmlFor="title" className="text-black font-semibold mb-1">Title</Label>
              <Input id="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Supreme Box Logo Hoodie" className="bg-white border-neutral-200 text-black" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand" className="text-black font-semibold mb-1">Brand</Label>
                <Select onValueChange={(v) => handleSelect("brand", v)}>
                  <SelectTrigger className="bg-white border-neutral-200 text-black">
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
                <Label htmlFor="size" className="text-black font-semibold mb-1">Size</Label>
                <Input id="size" value={form.size} onChange={handleFormChange} placeholder="e.g. L" className="bg-white border-neutral-200 text-black" />
              </div>
            </div>
            <div>
              <Label htmlFor="condition" className="text-black font-semibold mb-1">Condition</Label>
              <Select onValueChange={(v) => handleSelect("condition", v)}>
                <SelectTrigger className="bg-white border-neutral-200 text-black">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="text-black font-semibold mb-1">Description</Label>
              <Textarea id="description" value={form.description} onChange={handleFormChange} placeholder="Describe your item..." className="bg-white border-neutral-200 min-h-[80px] resize-none text-black" />
            </div>
          </form>
          <div className="sticky bottom-0 left-0 w-full bg-white pt-4 pb-2 flex gap-2">
            <Button variant="outline" className="rounded-full h-11 w-1/2" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              className="rounded-full h-11 w-1/2 text-base font-semibold"
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-2 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-10 relative flex flex-col mt-24">
        <ProgressBar step={3} />
        <h1 className="text-2xl font-bold text-center mb-2 text-black">Set Your Price</h1>
        <p className="text-black text-center mb-6">Choose your selling speed and get an AI price suggestion</p>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-black font-semibold">Selling Speed</Label>
            <span className="text-xs text-blue-600 font-medium">
              {sellSpeed < 33 ? "Fast Sale" : sellSpeed < 66 ? "Balanced" : "Max Value"}
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
          <div className="flex justify-between text-xs text-neutral-400 mt-1">
            <span>Sell Fast</span>
            <span>Max Value</span>
          </div>
        </div>
        {/* AI Price Recommendation */}
        <div className="mb-8">
          {!aiPrice && !isGenerating && (
            <div className="text-center">
              <Button
                onClick={generatePrice}
                className="rounded-full bg-blue-600 hover:bg-blue-700 h-11 px-8 text-base font-semibold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Get AI Price
              </Button>
            </div>
          )}
          {isGenerating && (
            <div className="text-center animate-pulse">
              <Sparkles className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <div className="text-neutral-500">Analyzing market data...</div>
            </div>
          )}
          {aiPrice && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500 mb-1" />
              <div className="text-3xl font-black text-black">${aiPrice}</div>
              <div className="text-neutral-500 text-sm mb-2">AI recommended price</div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 left-0 w-full bg-white pt-4 pb-2 flex gap-2">
          <Button variant="outline" className="rounded-full h-11 w-1/2" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button
            className="rounded-full h-11 w-1/2 text-base font-semibold"
            disabled={!aiPrice}
            onClick={() => alert("Listing published!")}
          >
            Publish Listing
          </Button>
        </div>
      </div>
    </div>
  )
}
