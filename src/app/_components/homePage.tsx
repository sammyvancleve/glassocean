'use client'

import GalleryImage from "./galleryImage"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import GridGallery from "./gridGallery"
import FullScreenModal from "./fullScreenModal"
import ImageViewer from "./imageViewer"
import { Image, Model, LoraImageWeighting } from "@prisma/client"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { api } from "~/trpc/react"
import AppSidebar from "./appSideBar"
import ModelCard from "./modelCard"
import ImageGallery from "./imagesGallery"

interface HomePageProps {
  models: Model[]
  loras: Model[]
}

const HomePage: React.FC<HomePageProps> = ({ models, loras }) => {
  const [display, setDisplay] = useState('Images')

  const { data: imageFetch, isLoading: imagesLoading } = api.image.getLatestImagesByCursor.useQuery(
    {take: 40}
  )

  const modelCards = useMemo(() => {
    return models.map((model: Model, modelIndex: number) => {
      console.log(model)
      return (
        <ModelCard key={modelIndex} model={model}/>
      )
    })
  }, [models])

  const loraCards = useMemo(() => {
    return loras.map((model: Model, modelIndex: number) => {
      console.log(model)
      return (
        <ModelCard key={modelIndex} model={model}/>
      )
    })
  }, [models])

  return (
    <SidebarProvider className="z-20">
      <AppSidebar onSetDisplay={setDisplay} />
      <main className="w-full bg-fixed bg-gradient-to-b from-[#eefdfd] to-[#fcf5ff] text-zinc-700">
      <SidebarTrigger />
        {(display === 'Images') &&
          <ImageGallery images={imageFetch?.images || []} isLoading={imagesLoading} />
        }
        {(display === 'Models') &&
          <GridGallery columns={3} children={modelCards} className="px-4 py-2" />
        }
        {(display === 'Loras') &&
          <GridGallery columns={3} children={loraCards} className="px-4 py-2" />
        }
      </main>
      
    </SidebarProvider>
  )
}

export default HomePage