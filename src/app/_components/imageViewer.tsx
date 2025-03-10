import React from 'react'

import Image from 'next/image'

import { AspectRatio, } from '~/components/ui/aspect-ratio'

import { Image as DbImage, Model, } from '@prisma/client'
import ModelHover from './modelHover'

type AspectRatio = {
  w: number,
  h: number
}

interface ImageDTO extends DbImage {
  model: Model,
  loras: {
    model: Model,
    weight: number
  }[]
}

interface GalleryImageProps {
  alt?: string
  onClick?: () => void
  aspectRatio?: AspectRatio // e.g., "1/1", "16/9", "4/3"
  className?: string // Optional classNames for the container
  image?: ImageDTO
  onQuery: React.Dispatch<React.SetStateAction<Array<string>>>,
  onFilterChange: React.Dispatch<React.SetStateAction<string>>
}

const ModalImageViewer: React.FC<GalleryImageProps> = ({
  alt = 'Image', onClick, aspectRatio, className, image, onFilterChange, onQuery,
}) => {
  if (!image) return null
  // console.log('model', image)
  console.log('image url', image.imageUrl)
  console.log('image id', image.id)

  const handleModelClick = (modelId: number) => {
    onFilterChange('model')
    onQuery([modelId.toString()])
  }

  const handlePromptClick = (prompt: string) => {
    onFilterChange('prompt')
    onQuery([prompt])
  }

  return (
    <div className='grid gap-4 w-full h-full grid-cols-2'>
      <div className='relative col-span-1'>
        <Image fill={true} blurDataURL={`/api/blur/${image.id}`} placeholder={'blur'} src={`/api/image/${image.id}`} alt='Image' className='object-contain' />
      </div>
      <div key={`imgview-${image.id}`} className='flex flex-col gap-2 bg-white rounded-sm w-full col-span-1 text-black overflow-scroll p-2'>
        <p>Hash: {image.hash}</p>
        <p>Seed: {image.seed}</p>
        <div className='max-h-48 overflow-scroll'>
          <p onClick={() => handlePromptClick(image.prompt)}>Prompt: {image.prompt}</p>
        </div>
        {image.model 
              && <ModelHover model={image.model} type={'main'} onModelClick={() => handleModelClick(image.model.id)}/>
        }
        <div key={`imgview-${image.id}-loras`} className='grid grid-cols-2 gap-2 w-full'>
          {image.loras
              && image.loras.map((lora) => (
                <div key={`imgview-${image.id}-${lora.model.id}`} className='flex w-full'>
                  < ModelHover model={lora.model} weight={lora.weight} type={'lora'} onModelClick={() => handleModelClick(lora.model.id)}/>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default ModalImageViewer