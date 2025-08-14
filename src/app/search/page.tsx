'use client'

import { useSearchParams, } from 'next/navigation'
import ImagesGrid from '../_components/images-grid'
import CommandBar from '../_components/command-bar'
import { useEffect, useState, } from 'react'
import { SidebarInset, SidebarProvider, } from '~/components/ui/sidebar'
import AppSidebar from '../_components/appSideBar'
import Pagination from '../_components/pagination'
import { useRouter, } from 'next/navigation'

const SearchPage = () => {
  const searchParams = useSearchParams()
  const seed = searchParams.get('seed')
  const model = searchParams.get('modelId')
  const [localSearchParams, setLocalSearchParams] = useState<Record<string, string>>({ seed: seed || '', model: model || '', })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const [filterOn, setFilterOn] = useState('')
  console.log('searchParams', localSearchParams)

  useEffect(() => {
    if (localSearchParams['seed'] !== '') {
      setFilterOn('seed')
    } else if (localSearchParams['model'] !== '') {
      setFilterOn('model')
    } else {
      setFilterOn('seed')
    }
  }, [localSearchParams])

  const handleSearch = (params: Record<string, string>) => {
    setLocalSearchParams(params)
    setPage(1)
  }

  const sideBarButtonClicked = () => {
    router.push('/')
    console.log('clicked')
  }

  return (
    <SidebarProvider>
      <AppSidebar onSetDisplay={sideBarButtonClicked} />
      <SidebarInset>
        <div className='bg-fixed bg-gradient-to-b from-[#eefdfd] to-[#f6e8fc] flex h-full flex-col'>
          <div className='container mx-auto p-6 flex-1 overflow-auto'>
            <div className='mb-8'>
              <h1 className='text-2xl font-bold'>Search Results</h1>
              {seed && <p className='text-muted-foreground'>Showing images with seed: {seed}</p>}
            </div>

            <div className='mb-6'>
              <CommandBar section='images' onSearch={handleSearch} onValueChange={() => console.log('onvaluechange')} />
            </div>

            <ImagesGrid filterOn={filterOn} page={page} searchParams={localSearchParams} setTotalPages={setTotalPages} />
          </div>
          <footer className='border-t p-4'>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SearchPage