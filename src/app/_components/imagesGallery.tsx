import React, { useCallback, useMemo, useState, useEffect, } from 'react'
import GalleryImage from './galleryImage'
import FullScreenModal from './fullScreenModal'
import ImageViewer from './imageViewer'
import { Image, Model, } from '@prisma/client'
import GridGallery from './gridGallery'
import { AspectRatio, } from '~/components/ui/aspect-ratio'

interface ImageDTO extends Image {
  model: Model,
  loras: {
    model: Model,
    weight: number
  }[]
}

interface ImageGalleryProps {
  images: ImageDTO[],
  isLoading: boolean,
  totalItems: number,
  onQuery: React.Dispatch<React.SetStateAction<Array<string>>>,
  onFilterChange: React.Dispatch<React.SetStateAction<string>>
}

const ImageGallery: React.FC<ImageGalleryProps> = React.memo(({
  images, isLoading, totalItems, onQuery, onFilterChange, 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<Image | null>(null)
  const [focusedImageIndex, setFocusedImageIndex] = useState(0)
  // const [currentImage, setCurrentImage] = useState<Image | null>(null)

  const openModal = useCallback(() => {
    // setModalImage(null)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const galleryImages = useMemo(() => {
    if (!images || images.length === 0) return [] // No images available

    return images.map((image, imageIndex: number) => {
      const handleClick = (imageIndex: number) => {
        console.log('clicked at index', imageIndex)
        updateModalImage(imageIndex)
        openModal()
      }

      return (
        <GalleryImage
          key={imageIndex}
          blurUrl={`/api/blur/${image.id}`}
          src={`/api/preview/${image.id}`}
          onClick={() => handleClick(imageIndex)}
          aspectRatio={{w: 3, h: 4,}}
        />
      )
    })
  }, [images])

  const updateModalImage = useCallback((index: number) => {
    if (images[index]) {
      setFocusedImageIndex(index)
      setModalImage(images[index])
    }
  }, [images, focusedImageIndex])

  const handleEsc = useCallback((event: { key: string }) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }, [closeModal])

  const handleArrowKeys = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      if (focusedImageIndex < images.length - 1) {
        console.log('old index', images[focusedImageIndex])
        console.log('new index', images[focusedImageIndex + 1])
        updateModalImage(focusedImageIndex + 1)
      }
    }
    if (event.key === 'ArrowLeft') {
      if (focusedImageIndex > 0) {
        updateModalImage(focusedImageIndex - 1)
      } 
    }
  }, [focusedImageIndex, images.length])

  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('keydown', handleArrowKeys)

    return () => {
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [handleEsc, handleArrowKeys])

  if (isLoading) {
    const loading = []
    for (let i = 0; i < totalItems; i++) {
      loading.push(<AspectRatio ratio={3 / 4} key={`placeholder-${i}`} className={'overflow-hidden transform transition duration-500 cursor-pointer group bg-black bg-opacity-10 rounded-md animate-pulse'}></AspectRatio>)
    }
    return (
      <GridGallery columns={6} children={loading} className='px-4 py-3' />
    )
  }

  if (!images || images.length === 0) {
    return <div>No images available.</div>
  }

  return (
    <div>
      <GridGallery columns={6} children={galleryImages} className='px-4 py-3 mb-5' />
      <div className='z-50'>
        {isModalOpen && modalImage && (
          <FullScreenModal isOpen={isModalOpen} onClose={closeModal}>
            <div
              className='relative w-[75%] h-[85%] rounded-sm bg-white/85 flex items-center justify-center p-4 z-50'
              onClick={(e) => e.stopPropagation()}
            >
              <ImageViewer onQuery={onQuery} onFilterChange={onFilterChange} image={images[focusedImageIndex]} />
            </div>
          </FullScreenModal>
        )}
      </div>
    </div>
  )
})

export default ImageGallery
