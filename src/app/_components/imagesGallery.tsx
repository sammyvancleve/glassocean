import React, { useCallback, useMemo, useState, useEffect } from "react";
import GalleryImage from "./galleryImage";
import FullScreenModal from "./fullScreenModal";
import ImageViewer from "./imageViewer";
import { Image } from "@prisma/client";
import GridGallery from "./gridGallery";

interface ImageGalleryProps {
  images: Image[];
  isLoading: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = React.memo(({ images, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<Image | null>(null);
  const [focusedImageIndex, setFocusedImageIndex] = useState(0);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const galleryImages = useMemo(() => {
    if (!images || images.length === 0) return []; // No images available

    return images.map((image, imageIndex: number) => {
      const handleClick = (imageIndex: number) => {
        updateModalImage(imageIndex);
        openModal();
      };

      return (
        <GalleryImage
          key={imageIndex}
          src={`/api/image/${image.id}`}
          onClick={() => handleClick(imageIndex)}
        />
      );
    });
  }, [images]);

  const updateModalImage = useCallback((index: number) => {
    if (images[index]) {
      setFocusedImageIndex(index);
      setModalImage(images[index]);
    }
  }, [images]);

  const handleEsc = useCallback((event: { key: string }) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

  const handleArrowKeys = useCallback((event: KeyboardEvent) => {
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
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [handleEsc, handleArrowKeys]);

  // Handling loading state and empty image state
  if (isLoading) {
    return <div>Loading images...</div>;
  }

  if (!images || images.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <>
      <GridGallery columns={6} children={galleryImages} className="px-4 py-2" />
      {isModalOpen && modalImage && (
        <FullScreenModal isOpen={isModalOpen} onClose={closeModal}>
          <div
            className="relative w-[75%] h-[85%] rounded-sm bg-white/85 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageViewer image={images[focusedImageIndex]} />
          </div>
        </FullScreenModal>
      )}
    </>
  );
})

export default ImageGallery
