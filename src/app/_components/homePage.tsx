'use client'

import { useEffect, useMemo, useState, } from 'react'
import GridGallery from './gridGallery'
import { Model, } from '@prisma/client'
import { SidebarProvider, SidebarTrigger, } from '~/components/ui/sidebar'
import { api, } from '~/trpc/react'
import AppSidebar from './appSideBar'
import ModelCard from './modelCard'
import ImageGallery from './imagesGallery'
import Paginator from './paginator'
import FolderAdder from './folder'
import ControlBar from './controlBar'

interface HomePageProps {
  models: Model[]
  loras: Model[]
}

const TOTAL_ITEMS = 24

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

const HomePage: React.FC<HomePageProps> = ({ models, loras, }) => {
  const [display, setDisplay] = useState('Images')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filteringOn, setFilterOn] = useState<FilterOptions>(FILTER_OPTIONS.NONE)
  const [sortBy, setSortingBy] = useState<SortOptions>(SORT_OPTIONS.LATEST)
  const [filterQuery, setFilterQuery] = useState<string[]>([])

  const {data: imageFetch, isLoading: imagesLoading, } = api.image.getImagesByPage.useQuery(
    {
      take: TOTAL_ITEMS, page: currentPage, filteringOn: filteringOn, query: filterQuery, sortBy: sortBy,
    }
  )
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const modelCards = useMemo(() => {
    return models.map((model: Model, modelIndex: number) => {
      console.log(model)
      return (
        <ModelCard key={`lora-${modelIndex}`} model={model}/>
      )
    })
  }, [models])

  const loraCards = useMemo(() => {
    return loras.map((model: Model, modelIndex: number) => {
      console.log(model)
      return (
        <ModelCard key={`model-${modelIndex}`} model={model}/>
      )
    })
  }, [models])

  useEffect(() => {
    if (imageFetch?.imageCount) {
      const calculatedTotalPages = Math.ceil(imageFetch.imageCount / TOTAL_ITEMS)
      setTotalPages(calculatedTotalPages)
    }
  }, [imageFetch, filterQuery, filteringOn, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [filterQuery, filteringOn, sortBy])

  return (
    <SidebarProvider className='z-20'>
      <AppSidebar onSetDisplay={setDisplay} />
      <main className='w-full bg-fixed bg-gradient-to-b from-[#eefdfd] to-[#f6e8fc] flex flex-col h-screen text-zinc-700'>
        <SidebarTrigger />
        <div className='relative bg-white bg-opacity-25'>
          <ControlBar onQuery={setFilterQuery} onFilterChange={setFilterOn}/>
        </div>
        <div className='z-20 overflow-y-auto h-screen'>
          {(display === 'Images')
          && <ImageGallery onQuery={setFilterQuery} onFilterChange={setFilterOn} 
            images={imageFetch?.images || []} isLoading={imagesLoading} totalItems={TOTAL_ITEMS}/>
          }
          {(display === 'Models')
          && <GridGallery columns={4} children={modelCards} className='px-4 py-3' />
          }
          {(display === 'Loras')
          && <GridGallery columns={4} children={loraCards} className='px-4 py-3' />
          }
          {(display === 'Settings')
          && <div>
            <FolderAdder />
          </div>
          }
        </div>
        <div className='bg-gray-100 bg-opacity-75 relative -mt-9 z-20'>
          <Paginator pages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
        </div>
      </main>
    </SidebarProvider>
  )
}

export default HomePage