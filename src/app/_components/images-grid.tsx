'use client'

import { useState, useEffect, useCallback, SetStateAction, Dispatch, } from 'react'
import Image from 'next/image'
import ImageModal from './newModal'

import { Image as DbImage, Tag, Model, } from '@prisma/client'
import { api, } from '~/trpc/react'

interface ImagesGridProps {
  page: number
  searchParams: Record<string, string>
  setTotalPages: Dispatch<SetStateAction<number>>
  filterOn?: string,
}

export interface LoraWithWeighting extends Model {
  weight: number,
  model: Model
}

export interface ImageDTO extends DbImage {
  tags: Tag[],
  model: Model,
  loras: LoraWithWeighting[]
}

export type FilterOptions = 'prompt' | 'exact_prompt' | 'model' | 'seed'

export type SortOptions = 'id' | 'latest'

const totalItems = 15

const ImagesGrid = ({
  page, searchParams, filterOn, setTotalPages,
}: ImagesGridProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [images, setImages] = useState<ImageDTO[]>([])
  const [filteringOn, setFilteringOn] = useState<string>(filterOn ?? 'prompt')
  const [query, setQuery] = useState<string[]>([''])
  const [sortBy, setSortBy] = useState('latest')
  console.log('parmas', searchParams)

  const { data: imageFetch, isLoading: imagesLoading, } = api.image.getImagesByPage.useQuery(
    {
      take: totalItems, page, filteringOn, query, sortBy,
    }
  )

  useEffect(() => {
    if (!imagesLoading && imageFetch) {
      setImages(imageFetch?.images)
    }
    if (imageFetch?.imageCount || imageFetch?.imageCount == 0) {
      const calculatedTotalPages = Math.ceil(imageFetch.imageCount / totalItems)
      setTotalPages(calculatedTotalPages)
    }
  }, [imageFetch, searchParams])

  const handleSearch = (queryOn: string, query: string[]) => {
    setFilteringOn(queryOn)
    setQuery(query)
  }

  useEffect(() => {
    if (searchParams['prompt']) {
      setFilteringOn('prompt')
      setQuery(searchParams['prompt'].split(' '))
    }
    if (searchParams['seed']) {
      setFilteringOn('seed')
      setQuery([searchParams['seed']])
    }
    if (searchParams['model']) {
      setFilteringOn('model')
      setQuery([searchParams['model']])
    }
  }, [searchParams])

  // const handleUpdateTags = (imageId: string, userTags: string[]) => {
  //   setImages((prevImages) => prevImages.map((img) => (img.id === imageId ? { ...img, userTags, } : img)))
  // }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selectedImageIndex === null) return

      if (event.key === 'ArrowLeft') {
        setSelectedImageIndex((prevIndex) => (prevIndex !== null ? Math.max(0, prevIndex - 1) : null))
      } else if (event.key === 'ArrowRight') {
        setSelectedImageIndex((prevIndex) => (prevIndex !== null ? Math.min(images.length - 1, prevIndex + 1) : null))
      }
    },
    [selectedImageIndex, images.length]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {images.map((image, index) => (
          <div
            key={image.id}
            className='group cursor-pointer overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md'
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className='aspect-square overflow-hidden'>
              <Image
                blurDataURL={`/api/blur/${image.id}`}
                src={`/api/preview/${image.id}`}
                alt={`${image.prompt}`}
                width={512}
                height={512}
                className='h-full w-full object-cover transition-transform group-hover:scale-105'
              />
            </div>
            <div className='p-3'>
              <h3 className='font-medium line-clamp-1'>{image.hash}</h3>
              <p className='text-sm text-muted-foreground'>{image.model.name}</p>
              {(image.tags.length > 0) && (
                <div className='mt-2 flex flex-wrap gap-1'>
                  {image.tags.slice(0, 2).map((tag) => (
                    <span key={tag.id} className='rounded-full bg-muted px-2 py-0.5 text-xs'>
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ImageModal
        image={selectedImageIndex !== null ? (images[selectedImageIndex] ?? null) : null}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        onUpdateTags={() => console.log('idk')}
        onPrevious={() => setSelectedImageIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : null))}
        onNext={() => setSelectedImageIndex((prev) => (prev !== null ? Math.min(images.length - 1, prev + 1) : null))}
        hasPrevious={selectedImageIndex !== null && selectedImageIndex > 0}
        hasNext={selectedImageIndex !== null && selectedImageIndex < images.length - 1}
        clickToSearch={handleSearch}
      />
    </>
  )
}

export default ImagesGrid