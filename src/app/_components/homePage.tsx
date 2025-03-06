'use client'

import FolderAdder from "./folder"
import GalleryImage from "./galleryImage"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import GridGallery from "./gridGallery"
import FullScreenModal from "./fullScreenModal"
import ImageViewer from "./imageViewer"
import { Image, Model, LoraImageWeighting } from "@prisma/client"
import { Separator } from "~/components/ui/separator"
import SideBar from "./sideBar"

interface HomePageProps {
  images: Image[]
}

const HomePage: React.FC<HomePageProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<Image | null>(null)
  const [focusedImageIndex, setFocusedImageIndex] = useState(0)
  const galleryImageRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref to gallery images

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
      <main className="flex min-h-screen flex-col items-center bg-fixed bg-gradient-to-b from-[#eefdfd] to-[#fcf5ff] text-zinc-700">
        <div className="w-full mx-5 text-zinc-700 text-xl p-4">
          <h1 className="mb-2 mt-2">GlassOcean</h1>
          <Separator className="border-t-2 border-slate-300"/>
        </div>
        <div className="w-full flex flex-col">
          <div className="grid grid-cols-6 sm:grid-cols-5 md:gap-4">
            <div className="flex col-span-1">
              <SideBar />
              <Separator orientation="vertical" className="border-l-2 border-slate-300"/>
            </div>
            
            <div className="col-span-5 sm:col-span-4 pr-4">
              <GridGallery columns={6} children={galleryImages}/>
            </div>
          </div>
        </div>
        {isModalOpen && modalImage && (
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
        )}
      </main>
  )
}

export default HomePage