'use client'

import { Layers, } from 'lucide-react'
import { Model, } from '@prisma/client'
import { api, } from '~/trpc/react'
import { useEffect, useState, } from 'react'

interface ModelsGridProps {
  page: number
  searchParams: Record<string, string>
}

const ModelsGrid = ({ page, searchParams, }: ModelsGridProps) => {
  const [models, setModels] = useState<Model[]>([])

  const { data: modelFetch, isLoading: modelsLoading, } = api.model.getModelsByCursor.useQuery({ take: 40, })

  useEffect(() => {
    if (!modelsLoading && modelFetch) {
      setModels(modelFetch)
    }
  }, [modelFetch, searchParams])

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {models.map((model) => (
        <div
          key={model.id}
          className='cursor-pointer rounded-lg border bg-background p-4 shadow-sm transition-all hover:shadow-md'
        >
          <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
            <Layers className='h-6 w-6 text-primary' />
          </div>
          <h3 className='font-medium'>{model.name}</h3>
          <div className='mt-1 flex items-center gap-2'>
            <span className='rounded-full bg-muted px-2 py-0.5 text-xs'>{model.key}</span>
            <span className='rounded-full bg-muted px-2 py-0.5 text-xs'>{model.type}</span>
          </div>
          <p className='mt-2 text-sm text-muted-foreground line-clamp-2'>{model.hash}</p>
          {/* <div className='mt-3 text-sm text-muted-foreground'>{model.downloads.toLocaleString()} downloads</div> */}
        </div>
      ))}
    </div>
  )
}

export default ModelsGrid