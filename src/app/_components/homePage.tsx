'use client'

import { FolderAdder } from "./folder"

import GalleryImage from "./galleryImage"
import { useCallback, useEffect, useMemo, useState } from "react"
import GridGallery from "./gridGallery"
import FullScreenModal from "./fullScreenModal"
import ImageViewer from "./imageViewer"
import { api } from "~/trpc/server"
import { Image, Model, LoraImageWeighting } from "@prisma/client"
import { Separator } from "~/components/ui/separator"

interface HomePageProps {
  images: Image[]
}

const HomePage: React.FC<HomePageProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<Image | null>(null)
  const [focusedImageIndex, setFocusedImageIndex] = useState(0)

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const galleryImages = useMemo(() => {
    return images.map((image, imageIndex: number) => {
      const handleClick = (imageIndex: number) => {
        setFocusedImageIndex(imageIndex)
        openModal()
      }
      return <GalleryImage key={imageIndex} src={`/api/image/${image.id}`} onClick={() => handleClick(imageIndex)} />
    })
  }, [images, openModal])

  const handleEsc = useCallback((event: { key: string }) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }, [closeModal])
  
  const handleArrowKeys = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      setFocusedImageIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1))
    }
    if (event.key === 'ArrowLeft') {
      setFocusedImageIndex((prevIndex) => Math.max(0, prevIndex - 1))
    }
  }, [images.length])
  
  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('keydown', handleArrowKeys)
  
    return () => {
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [handleEsc, handleArrowKeys])

  const updateModalImage = useCallback(() => {
    if (images[focusedImageIndex]) {
      setModalImage(images[focusedImageIndex])
    }
  }, [focusedImageIndex, images])
  
  useEffect(() => {
    updateModalImage()
  }, [focusedImageIndex, updateModalImage])

  return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#7ae2e6] to-[#d384fc] text-zinc-700">
        <div className="w-full mx-5 text-zinc-700 text-xl p-4">
          <h1 className="mb-2 mt-2">GlassOcean</h1>
          <Separator className="border-t-2 border-slate-500"/>
        </div>
        <div className="w-full flex flex-col px-4">
          <div className="grid grid-cols-6 gap-4 sm:grid-cols-5 md:gap-8">
            <div className="flex col-span-1">
              <div className="w-7/8 p-4">
                <FolderAdder />
              </div>
              <div className="w-1/8">
                <Separator orientation="vertical" className="border-l-2 border-slate-500"/>
              </div>
            </div>
            
            <div className="col-span-5 sm:col-span-4">
              <GridGallery columns={6} children={galleryImages}/>
            </div>
          </div>
        </div>
        <FullScreenModal
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <div
            className="relative w-[75%] h-[85%] bg-white flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageViewer image={images[focusedImageIndex]} />
          </div>
        </FullScreenModal>
      </main>
  )
}

export default HomePage