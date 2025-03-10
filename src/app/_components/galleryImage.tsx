import React from 'react'

import Image from 'next/image'

import { AspectRatio, } from '~/components/ui/aspect-ratio'

type AspectWH = {
  w: number,
  h: number
}

interface GalleryImageProps {
  src: string,
  blurUrl?: string,
  alt?: string,
  onClick?: () => void,
  aspectRatio?: AspectWH,
  className?: string
  enableBlur?: boolean,
}

const GalleryImage: React.FC<GalleryImageProps> = React.memo(({
  src, blurUrl, onClick, aspectRatio = {w: 3, h: 4,}, className, 
}) => {
  return (
    <AspectRatio onClick={onClick} ratio={aspectRatio.w /  aspectRatio.h} className={`overflow-hidden transform transition duration-300 delay-75 hover:scale-105 cursor-pointer group bg-black bg-opacity-10 rounded-md ${className}`}>
      {blurUrl
        ? (<Image fill={true} blurDataURL={blurUrl} placeholder={'blur'} src={src} alt='Image' className='object-cover rounded-sm' />)
        :          ( <Image fill={true} src={src} alt='Image' className='object-cover rounded-sm' />)
      }
    </AspectRatio>
  )
})

export default GalleryImage