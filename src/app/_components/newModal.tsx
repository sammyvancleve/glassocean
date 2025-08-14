'use client'

import type React from 'react'

import { useState, useEffect, } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '~/components/ui/dialog'
import { Separator, } from '~/components/ui/separator'
import { Badge, } from '~/components/ui/badge'
import { Input, } from '~/components/ui/input'
import Image from 'next/image'
import { Copy, Download, Plus, Tag, X, ChevronLeft, ChevronRight, } from 'lucide-react'
import { Button, } from '~/components/ui/button'
import { useRouter, } from 'next/navigation'
import { Tag as DbTag, } from '@prisma/client'
import { api, } from '~/trpc/react'
import { ImageDTO, } from './images-grid'
import { VisuallyHidden, } from '@radix-ui/react-visually-hidden'
import Rating from './rating'

interface ImageModalProps {
  image: ImageDTO | null
  isOpen: boolean
  onClose: () => void
  onUpdateTags?: (imageId: string, tags: string[]) => void
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
  clickToSearch: (queryOn: string, query: string[]) => void
}

const ImageModal = ({
  image,
  isOpen,
  onClose,
  onUpdateTags,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  clickToSearch,
}: ImageModalProps) => {
  const [newTag, setNewTag] = useState('')
  const [userTags, setUserTags] = useState<DbTag[]>(image?.tags || [])
  const [rating, setRating] = useState(image?.rating ?? 0)
  const router = useRouter()

  const createNewTagWithImage = api.tag.addTagWithImage.useMutation()

  useEffect(() => {
    setUserTags(image?.tags || [])
  }, [image])

  if (!image) return null

  const copyPrompt = () => {
    navigator.clipboard.writeText(image.prompt)
  }

  const handleAddTag = async () => {
    // if (newTag.trim() && !userTags.includes(newTag.trim())) {
    //   const updatedTags = [...userTags, newTag.trim()]
    //   setUserTags(updatedTags)
    //   setNewTag('')

    //   // Call the parent component's update function if provided
    //   if (onUpdateTags) {
    //     onUpdateTags(image.id, updatedTags)
    //   }
    // }
    if (newTag.trim()) {
      const addedTag = await createNewTagWithImage.mutateAsync({ imageId: image.id, tagName: newTag, })
      const updatedTags = [...userTags, addedTag]
      setUserTags(updatedTags)
      setNewTag('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSeedClick = () => {
    router.push(`/search?seed=${image.seed}`)
  }

  const handleModelClick = (modelId: number) => {
    router.push(`/search?modelId=${modelId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl'>
        <VisuallyHidden>
          <DialogHeader className='invisible h-0'>
            <DialogTitle>{image.hash}</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div className='grid gap-6 py-1 md:grid-cols-2'>
          <div className='flex flex-col'>
            <div className='relative overflow-hidden rounded-lg border'>
              <Image
                blurDataURL={`/api/blur/${image.id}`}
                placeholder={'blur'}
                src={`/api/image/${image.id}`}
                alt={image.prompt}
                width={512}
                height={512}
                className='h-full w-full object-contain'
              />
              <div className='absolute bottom-2 left-2 right-2 flex justify-between'>
                <Button variant='secondary' size='icon' onClick={onPrevious} disabled={!hasPrevious}>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button variant='secondary' size='icon' onClick={onNext} disabled={!hasNext}>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>Model</h3>
              <p onClick={() => handleModelClick(image.model.id)} className='text-primary hover:underline hover:cursor-pointer'>
                {image.model.name}
              </p>
            </div>

            {image.loras && image.loras.length > 0 && (
              <div>
                <h3 className='text-sm font-medium text-muted-foreground'>LoRAs</h3>
                <ul className='mt-1 space-y-1 grid grid-cols-2'>
                  {image.loras.map((lora) => (
                    <li key={`${image.id}-${lora.model.id}-${lora.weight}`}>
                      <p onClick={() => handleModelClick(lora.model.id)} className='text-primary hover:underline hover:cursor-pointer'>
                        {lora.model.name}
                      </p>
                      <span className='text-sm text-muted-foreground'> (weight: {lora.weight})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium text-muted-foreground'>Prompt</h3>
                <Button variant='ghost' size='icon' onClick={copyPrompt}>
                  <Copy className='h-4 w-4' />
                  <span className='sr-only'>Copy prompt</span>
                </Button>
              </div>
              <p className='max-h-24 overflow-y-auto whitespace-pre-wrap text-sm text-primary hover:underline hover:cursor-pointer'>
                {image.prompt}
              </p>
            </div>
            {image.negativePrompt
              && <div>
                <h3 className='text-sm font-medium text-muted-foreground'>Negative Prompt</h3>
                <p className='whitespace-pre-wrap text-sm'>{image.negativePrompt}</p>
              </div>
            }

            <Rating objectRating={rating} />

            <Separator />
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground'>Seed</h3>
                <p>
                  <Button variant='link' className='p-0 h-auto font-normal' onClick={handleSeedClick}>
                    {image.seed}
                  </Button>
                </p>
              </div>
              {/* <div>
                <h3 className='text-sm font-medium text-muted-foreground'>Size</h3>
                <p>
                  {image.width} × {image.height}
                </p>
              </div> */}
              {/* <div>
                <h3 className='text-sm font-medium text-muted-foreground'>Steps</h3>
                <p>{image.steps}</p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground'>CFG Scale</h3>
                <p>{image.cfgScale}</p>
              </div> */}
              {/* <div>
                <h3 className='text-sm font-medium text-muted-foreground'>Sampler</h3>
                <p>
                  <Link
                    href={`/samplers/${encodeURIComponent(image.sampler)}`}
                    className='text-primary hover:underline'
                  >
                    {image.sampler}
                  </Link>
                </p>
              </div> */}
            </div>
            <div className='mt-4'>
              <h3 className='mb-2 text-sm font-medium text-muted-foreground'>Tags</h3>
              <div className='flex flex-wrap gap-2'>
                {userTags.map((tag) => (
                  <Badge key={tag.id} variant='outline' className='flex items-center gap-1 bg-primary/10'>
                    <p onClick={() => console.log('idk')} className='hover:cursor-pointer hover:underline'>
                      {tag.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        // handleRemoveTag(tag)
                        console.log('handleRemoveTag')
                      }}
                      className='ml-1 rounded-full hover:bg-primary/20 p-0.5'
                    >
                      <X className='h-3 w-3' />
                      <span className='sr-only'>Remove {tag.name}</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className='mt-3 flex gap-2'>
                <div className='relative flex-1'>
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder='Add a tag...'
                    onKeyDown={handleKeyDown}
                    className='pr-8'
                  />
                  <Tag className='absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                </div>
                <Button size='sm' onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Plus className='mr-1 h-4 w-4' />
                  Add
                </Button>
              </div>
            </div>
            <div className='mt-auto'>
              <a href={`/api/image/${image.id}`}
                download={`go-${image.hash}.png`}>
                <Button className='w-full gap-2' >
                  <Download className='h-4 w-4' />
                  Download Image
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageModal