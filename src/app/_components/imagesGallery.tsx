import React, { useCallback, useMemo, useState, useEffect, } from 'react'
import GalleryImage from './galleryImage'
import FullScreenModal from './fullScreenModal'
import ImageViewer from './imageViewer'
import { Image, } from '@prisma/client'
import GridGallery from './gridGallery'
import Paginator from './paginator'
import { api, } from '~/trpc/react'
import ControlBar from './controlBar'
import ImageModal from './newModal'

interface ImageGalleryProps {
  totalItems: number,
}

const FILTER_OPTIONS = {
  PROMPT_TEXT: 'prompt',
  EXACT_PROMPT_TEXT: 'prompt_exact',
  SEED: 'seed',
  MODEL: 'model',
  LORAS: 'loras',
  NONE: '',
}

type FilterOptions = (typeof FILTER_OPTIONS)[keyof typeof FILTER_OPTIONS]

const SORT_OPTIONS = {
  LATEST: 'latest',
  ID: 'id',
}

type SortOptions = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]

const ImageGallery: React.FC<ImageGalleryProps> = React.memo(({ totalItems, }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<Image | null>(null)
  const [focusedImageIndex, setFocusedImageIndex] = useState(null)
  const [filteringOn, setFilterOn] = useState<FilterOptions>(FILTER_OPTIONS.NONE)
  const [sortBy, setSortingBy] = useState<SortOptions>(SORT_OPTIONS.LATEST)
  const [filterQuery, setFilterQuery] = useState<string[]>([])

  const { data: imageFetch, isLoading: imagesLoading, } = api.image.getImagesByPage.useQuery(
    {
      take: totalItems, page: currentPage, filteringOn, query: filterQuery, sortBy: sortBy,
    }
  )

  useEffect(() => {
    if (imageFetch?.imageCount) {
      const calculatedTotalPages = Math.ceil(imageFetch.imageCount / totalItems)
      setTotalPages(calculatedTotalPages)
    }
  }, [imageFetch, filterQuery, filteringOn, sortBy])

  useEffect(() => {
    console.log('filterQuery', filterQuery)
    console.log('filteringOn', filteringOn)
    console.log('sortBy', setSortingBy)
    setCurrentPage(1)
  }, [filterQuery, filteringOn, sortBy])

  const openModal = useCallback(() => {
    // setModalImage(null)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const galleryImages = useMemo(() => {
    if (!imageFetch?.images || imageFetch?.images.length === 0) return [] // No images available

    return imageFetch?.images.map((image, imageIndex: number) => {
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
          aspectRatio={{ w: 3, h: 4, }}
        />
      )
    })
  }, [imageFetch?.images])

  const updateModalImage = useCallback((index: number) => {
    if (imageFetch?.images[index]) {
      setFocusedImageIndex(index)
      setModalImage(imageFetch?.images[index])
    }
  }, [imageFetch?.images, focusedImageIndex])

  const handleEsc = useCallback((event: { key: string }) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }, [closeModal])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleArrowKeys = useCallback((event: KeyboardEvent) => {
    if (imageFetch?.images) {
      if (event.key === 'ArrowRight') {
        if (focusedImageIndex < imageFetch?.images.length - 1) {
          console.log('old index', imageFetch?.images[focusedImageIndex])
          console.log('new index', imageFetch?.images[focusedImageIndex + 1])
          updateModalImage(focusedImageIndex + 1)
        }
        else if (focusedImageIndex == imageFetch?.images.length - 1
          && currentPage < totalPages
        ) {
          handlePageChange(currentPage + 1)
          setFocusedImageIndex(0)
        }
      }
      if (event.key === 'ArrowLeft') {
        if (focusedImageIndex > 0) {
          updateModalImage(focusedImageIndex - 1)
        }
        else if (focusedImageIndex === 0 && currentPage !== 1) {
          handlePageChange(currentPage - 1)
          setFocusedImageIndex(totalItems - 1)
        }
      }
    }
  }, [focusedImageIndex, imageFetch?.images.length])

  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('keydown', handleArrowKeys)

    return () => {
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [handleEsc, handleArrowKeys])

  useEffect(() => {
    closeModal()
  }, [filterQuery, filteringOn])


  return (
    <div className='w-full'>
      <div className='bg-white bg-opacity-25'>
        <ControlBar onQuery={setFilterQuery} onFilterChange={setFilterOn} />
      </div>
      <div>
        {!imagesLoading
          && <GridGallery columns={6} children={galleryImages} className='px-4 py-3 mb-5' />
        }
        {/* <div className='z-50'>
          {isModalOpen && modalImage && (
            <FullScreenModal isOpen={isModalOpen} onClose={closeModal}>
              <div
                className='relative w-[80%] h-[90%] rounded-sm bg-white/85 flex items-center justify-center p-4 z-50'
                onClick={(e) => e.stopPropagation()}
              >
                <ImageViewer onQuery={setFilterQuery} onFilterChange={setFilterOn} image={imageFetch?.images[focusedImageIndex]} />
              </div>
            </FullScreenModal>
          )}
        </div> */}
      </div>
      {!imagesLoading
        && <div className='bg-slate-100 bg-opacity-50 relative z-30'>
          <Paginator pages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      }
      <ImageModal
        image={focusedImageIndex !== null ? imageFetch?.images[focusedImageIndex] : null}
        isOpen={focusedImageIndex !== null}
        onClose={() => setFocusedImageIndex(null)}
        onUpdateTags={() => console.log('id')}
        onPrevious={() => setFocusedImageIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : null))}
        onNext={() => setFocusedImageIndex((prev) => (prev !== null ? Math.min(images.length - 1, prev + 1) : null))}
        hasPrevious={focusedImageIndex !== null && focusedImageIndex > 0}
        hasNext={focusedImageIndex !== null && focusedImageIndex < imageFetch?.images.length - 1}
      />
    </div>
  )
})

export default ImageGallery
