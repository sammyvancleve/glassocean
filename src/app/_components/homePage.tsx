'use client'

import { FolderAdder } from "./folder"

import GalleryImage from "./galleryImage"
import { useCallback, useEffect, useMemo, useState } from "react"
import GridGallery from "./gridGallery"
import FullScreenModal from "./fullScreenModal"
import ImageViewer from "./imageViewer"
import { api } from "~/trpc/server"
import { Image, Model, LoraImageWeighting } from "@prisma/client"

interface HomePageProps {
  images: Image[]
}

const HomePage: React.FC<HomePageProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')
  const [focusedImageIndex, setFocusedImageIndex] = useState(0)

  const openModal = useCallback((image: Image) => {
    setIsModalOpen(true)
    setModalImage(image)
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const galleryImages = useMemo(() => {
    return images.map((image, imageIndex) => {
      const handleClick = () => openModal(image)
      return <GalleryImage key={imageIndex} src={`/api/image/${image.id}`} onClick={handleClick} />
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
      setModalImage(`/api/image/${images[focusedImageIndex].id}`)
    }
  }, [focusedImageIndex, images])
  
  useEffect(() => {
    updateModalImage()
  }, [focusedImageIndex, updateModalImage])

  return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#efddf1] to-[#c0e3f7] text-white">
        <div className="container flex flex-col gap-12 px-4 py-16">
          <div className="grid grid-cols-6 gap-4 sm:grid-cols-5 md:gap-8">
            <div className="col-span-1 sm:col-span-1">
              <FolderAdder />
            </div>
            <div className="col-span-5 sm:col-span-4">
              <GridGallery columns={5} children={galleryImages}/>
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
            <ImageViewer image={images[focusedImageIndex]} src={modalImage} />
          </div>
        </FullScreenModal>
      </main>
  )
}

export default HomePage