import React from 'react'

import Image from "next/image"

import { AspectRatio } from '~/components/ui/aspect-ratio'

import { Image as DbImage } from '@prisma/client'

type AspectRatio = {
    w: number,
    h: number
}

interface GalleryImageProps {
  alt?: string
  onClick?: () => void
  aspectRatio?: AspectRatio // e.g., "1/1", "16/9", "4/3"
  className?: string // Optional classNames for the container
  image?: DbImage
}

const ModalImageViewer: React.FC<GalleryImageProps> = React.memo(({ alt = 'Image', onClick, aspectRatio, className, image }) => {
  if (!image) return null

  return (
    <div className='grid gap-4 w-full h-full grid-cols-2'>
        <div className='relative col-span-1'>
            <Image fill={true} src={`/api/image/${image.id}`} alt="Image" className="object-contain" />
        </div>
        <div className='w-full col-span-1 text-black overflow-scroll'>
            <p>Hash: {image.hash}</p>
            <p>Prompt: {image.prompt}</p>
            {image.loras &&
              image.loras.map((lora, loraIndex) => (
                <div key={loraIndex}>
                  <p>lora: {lora.model.name}</p>
                  <p>weighting: {lora.weight}</p>
                </div>
              ))
            }
            {image.model && 
              <div>
                <p>model: {image.model.name}</p>
                </div>
            }
        </div>
    </div>
  )
})

export default ModalImageViewer