'use client'

import GalleryImage from "./galleryImage"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import GridGallery from "./gridGallery"
import FullScreenModal from "./fullScreenModal"
import ImageViewer from "./imageViewer"
import { Image, Model, LoraImageWeighting } from "@prisma/client"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import AppSidebar from "./appSideBar"

interface HomePageProps {
  images: Image[]
}

const HomePage: React.FC<HomePageProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<Image | null>(null)
  const [focusedImageIndex, setFocusedImageIndex] = useState(0)
  const [display, setDisplay] = useState('Images')

  const openModal = useCallback(() => {
    console.log('index', focusedImageIndex)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const galleryImages = useMemo(() => {
    return images.map((image, imageIndex: number) => {
      const handleClick = (imageIndex: number) => {
        updateModalImage(imageIndex)
        openModal()
      }
      return (
        <GalleryImage
          key={imageIndex}
          src={`/api/image/${image.id}`}
          onClick={() => handleClick(imageIndex)}
        />
  )
    })
  }, [images])

  const handleEsc = useCallback((event: { key: string }) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }, [closeModal])
  
  const handleArrowKeys = useCallback((event: KeyboardEvent) => {
    console.log('focusedImageIndex', focusedImageIndex);
    if (event.key === 'ArrowRight') {
      if (focusedImageIndex < images.length - 1) {
        updateModalImage(focusedImageIndex + 1);
      }
    }
    if (event.key === 'ArrowLeft') {
      if (focusedImageIndex > 0) {
        updateModalImage(focusedImageIndex - 1);
      }
    }
  }, [focusedImageIndex, images.length]);
  
  
  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('keydown', handleArrowKeys)
  
    return () => {
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [handleEsc, handleArrowKeys])

  const updateModalImage = useCallback((index: number) => {
    if (images[index]) {
      setFocusedImageIndex(index)
      setModalImage(images[index])
    }
  }, [images])

  return (
    <SidebarProvider className="z-20">
      <AppSidebar onSetDisplay={setDisplay} />
      <main className="w-full bg-fixed bg-gradient-to-b from-[#eefdfd] to-[#fcf5ff] text-zinc-700">
      <SidebarTrigger />
        {(display === 'Images') &&
        <GridGallery columns={6} children={galleryImages} className="px-4 py-2"/>
        }
        {(display === 'Images') && isModalOpen && modalImage && (
          <FullScreenModal
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            <div
              className="relative w-[75%] h-[85%] rounded-sm bg-white/85 flex items-center justify-center p-4 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageViewer image={images[focusedImageIndex]} />
            </div>
          </FullScreenModal>
        )}
        {(display === 'Models') &&
        <p>asdfasdf</p>}
      </main>
      
    </SidebarProvider>
  )
}

export default HomePage