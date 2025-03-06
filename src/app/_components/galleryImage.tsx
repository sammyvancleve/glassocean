import React from 'react'

import Image from "next/image"

import { AspectRatio } from '~/components/ui/aspect-ratio'

type AspectRatio = {
    w: number,
    h: number
}

interface GalleryImageProps {
  src: string,
  alt?: string,
  onClick?: () => void,
  aspectRatio?: AspectRatio,
  className?: string
}

const GalleryImage: React.FC<GalleryImageProps> = React.memo(({ src, alt = 'Image', onClick, aspectRatio, className }) => {
  console.log('image', src)

  return (
    <div onClick={onClick} className="group bg-black bg-opacity-10 rounded-md hover:shadow-lg transition-shadow duration-200">
      <AspectRatio ratio={3 / 4} className="overflow-hidden">
        <Image fill={true} src={src} alt="Image" className="object-contain transition-transform duration-300 group-hover:scale-105" />
      </AspectRatio>
    </div>
  )
})

export default GalleryImage