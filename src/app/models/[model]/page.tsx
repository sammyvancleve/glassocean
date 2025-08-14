'use client'

import { useParams, } from 'next/navigation'
import ImagesGrid from '~/app/_components/images-grid'
import { Button, } from '~/components/ui/button'
import { Layers, Download, Star, } from 'lucide-react'

const ModelDetailPage = () => {
  const params = useParams()
  const modelName = decodeURIComponent(params.model as string)

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10'>
            <Layers className='h-8 w-8 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl font-bold'>{modelName}</h1>
            <p className='text-muted-foreground'>Stable Diffusion checkpoint</p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' className='gap-1'>
            <Star className='h-4 w-4' />
            Favorite
          </Button>
          <Button size='sm' className='gap-1'>
            <Download className='h-4 w-4' />
            Download
          </Button>
        </div>
      </div>

      <div className='mb-8 grid gap-6 md:grid-cols-3'>
        <div className='space-y-2'>
          <h3 className='font-medium'>Version</h3>
          <p className='text-sm'>1.0</p>
        </div>
        <div className='space-y-2'>
          <h3 className='font-medium'>Downloads</h3>
          <p className='text-sm'>25,432</p>
        </div>
        <div className='space-y-2'>
          <h3 className='font-medium'>Last Updated</h3>
          <p className='text-sm'>March 15, 2023</p>
        </div>
      </div>

      <div className='mb-8'>
        <h2 className='mb-4 text-xl font-semibold'>Description</h2>
        <p className='text-muted-foreground'>
          This is a high-quality image generation model for creating detailed artwork and photorealistic images. It
          excels at landscapes, portraits, and abstract art with exceptional detail and color accuracy.
        </p>
      </div>

      <div>
        <h2 className='mb-4 text-xl font-semibold'>Images created with this model</h2>
        <ImagesGrid page={1} searchParams={{}} />
      </div>
    </div>
  )
}

export default ModelDetailPage