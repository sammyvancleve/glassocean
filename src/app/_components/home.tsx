'use client'

import { useState, } from 'react'
import AppSidebar from './appSideBar'
// import { ImagesGrid, } from '~/components/images-grid'
// import { ModelsGrid, } from '~/components/models-grid'
// import { LorasGrid, } from '~/components/loras-grid'
// import { TagsGrid, } from '~/components/tags-grid'
// import { CommandBar, } from '~/components/command-bar'
// import { Pagination, } from '~/components/pagination'
import { SidebarInset, SidebarProvider, } from '~/components/ui/sidebar'
import CommandBar from './command-bar'
import Pagination from './pagination'
import ImagesGrid from './images-grid'
import ModelsGrid from './modelsGrid'

// type Section = 'images' | 'models' | 'loras' | 'tags'

const Gallery = () => {
  const [activeSection, setActiveSection] = useState('Images')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useState<Record<string, string>>({})

  const handleSearch = (params: Record<string, string>) => {
    setSearchParams(params)
    setPage(1)
  }

  return (
    <SidebarProvider>
      <AppSidebar onSetDisplay={setActiveSection} />
      <SidebarInset>
        <div className='bg-fixed bg-gradient-to-b from-[#eefdfd] to-[#f6e8fc] flex h-full flex-col'>
          <header className='border-b p-4'>
            <CommandBar section={activeSection} onSearch={handleSearch} />
          </header>
          <main className='flex-1 overflow-auto p-6'>
            {activeSection === 'Images' && <ImagesGrid page={page} setTotalPages={setTotalPages} searchParams={searchParams} />}
            {activeSection === 'Models' && <ModelsGrid page={page} searchParams={searchParams} />}
            {/* {activeSection === 'loras' && <LorasGrid page={page} searchParams={searchParams} />}
            {activeSection === 'tags' && <TagsGrid page={page} searchParams={searchParams} />} */}
          </main>
          <footer className='border-t p-4'>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Gallery