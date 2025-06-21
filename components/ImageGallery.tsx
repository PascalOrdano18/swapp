'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageRecord {
  image_url: string;
}

interface ImageGalleryProps {
  images: ImageRecord[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images?.[0]?.image_url);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="w-full aspect-square bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center border border-white/20">
          <Image
            src="/placeholder.svg?height=600&width=600"
            alt="Placeholder Image"
            width={600}
            height={600}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-full aspect-square bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center border border-white/20">
        <Image
          src={selectedImage || "/placeholder.svg?height=600&width=600"}
          alt={title || 'Item Image'}
          width={600}
          height={600}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      <div className="flex gap-3 w-full justify-center">
        {images.map((img, i) => (
          <button
            key={i}
            className={`w-20 h-20 rounded-xl overflow-hidden border bg-white/10 flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedImage === img.image_url ? 'border-purple-400 scale-105' : 'border-white/20 hover:border-white/50'}`}
            onClick={() => setSelectedImage(img.image_url)}
          >
            <Image src={img.image_url} alt={`${title} thumbnail ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  )
} 