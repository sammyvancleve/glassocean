'use client'

import { useState, } from 'react'
import { Search, SlidersHorizontal, X, } from 'lucide-react'
import { Button, } from '~/components/ui/button'
import { Input, } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '~/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger, } from '~/components/ui/popover'

// type Section = 'images' | 'models' | 'loras' | 'tags'

interface CommandBarProps {
  section: string
  onSearch: (params: Record<string, string>) => void
  onValueChange: () => void
}

//TODO fix delay in search update

const CommandBar = ({ section, onSearch, onValueChange, }: CommandBarProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const getDefaultSearchField = (section: string): string => {
    switch (section) {
      case 'Images':
        return 'prompt'
      case 'models':
        return 'name'
      case 'loras':
        return 'name'
      case 'tags':
        return 'name'
      default:
        return 'name'
    }
  }
  const [searchField, setSearchField] = useState<string>(getDefaultSearchField(section))
  const [sortBy, setSortBy] = useState('latest')
  const [filters, setFilters] = useState<Record<string, string>>({})

  const sortOptions = [
    { value: 'latest', label: 'Latest', },
    { value: 'id', label: 'Id', }
  ]

  const getSearchFields = (section: string): { value: string; label: string }[] => {
    switch (section) {
      case 'Images':
        return [
          { value: 'prompt', label: 'Prompt', },
          { value: 'model', label: 'Model', },
          { value: 'seed', label: 'Seed', },
          { value: 'tags', label: 'Tags', }
        ]
      case 'models':
        return [
          { value: 'name', label: 'Name', },
          { value: 'type', label: 'Type', },
          { value: 'version', label: 'Version', }
        ]
      case 'loras':
        return [
          { value: 'name', label: 'Name', },
          { value: 'creator', label: 'Creator', },
          { value: 'trainedOn', label: 'Trained On', }
        ]
      case 'tags':
        return [
          { value: 'name', label: 'Name', }
        ]
      default:
        return [{ value: 'name', label: 'Name', }]
    }
  }

  const getFilterOptions = (section: string): { id: string; label: string; options: string[] }[] => {
    switch (section) {
      case 'images':
        return [
          {
            id: 'resolution',
            label: 'Resolution',
            options: ['512x512', '768x768', '1024x1024'],
          },
          {
            id: 'sampler',
            label: 'Sampler',
            options: ['Euler a', 'DPM++ 2M Karras', 'DDIM'],
          }
        ]
      case 'models':
        return [
          {
            id: 'type',
            label: 'Type',
            options: ['Checkpoint', 'LoRA', 'Textual Inversion'],
          }
        ]
      case 'loras':
        return [
          {
            id: 'baseModel',
            label: 'Base Model',
            options: ['SD 1.5', 'SDXL 1.0'],
          }
        ]
      case 'tags':
        return [
          {
            id: 'category',
            label: 'Category',
            options: ['Style', 'Subject', 'Color', 'Technique'],
          }
        ]
      default:
        return []
    }
  }

  const handleSearch = () => {
    const params: Record<string, string> = { ...filters, }

    if (searchTerm) {
      params[searchField] = searchTerm
    }

    onSearch(params)
  }

  const handleFilterChange = (id: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
    onSearch({})
  }

  const searchFields = getSearchFields(section)
  const filterOptions = getFilterOptions(section)
  const hasActiveFilters = searchTerm || Object.keys(filters).length > 0

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='flex flex-1 min-w-[200px]'>
          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className='w-[150px] rounded-r-none border-r-0'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='relative flex-1'>
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                // onValueChange()
                handleSearch()
              }}
              placeholder={`Search by ${searchFields.find((f) => f.value === searchField)?.label.toLowerCase() || 'name'}...`}
              className='rounded-l-none pl-3 pr-8'
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchTerm && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3'
                onClick={() => {
                  setSearchTerm('')
                  // onValueChange()
                }}
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>Clear search</span>
              </Button>
            )}
          </div>
        </div>

        <Button onClick={handleSearch} size='icon' variant='secondary'>
          <Search className='h-4 w-4' />
          <span className='sr-only'>Search</span>
        </Button>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-[150px] rounded-sm border-r-0'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='gap-1'>
              <SlidersHorizontal className='h-4 w-4' />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className='ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80'>
            <div className='grid gap-4'>
              <div className='space-y-2'>
                <h4 className='font-medium leading-none'>Filters</h4>
                <p className='text-sm text-muted-foreground'>Narrow down your search results</p>
              </div>
              <div className='grid gap-2'>
                {filterOptions.map((filter) => (
                  <div key={filter.id} className='grid gap-1'>
                    <label htmlFor={filter.id} className='text-sm font-medium'>
                      {filter.label}
                    </label>
                    <Select
                      value={filters[filter.id] || ''}
                      onValueChange={(value) => handleFilterChange(filter.id, value)}
                    >
                      <SelectTrigger id={filter.id}>
                        <SelectValue placeholder={`Select ${filter.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='any'>Any</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  handleSearch()
                  setIsFiltersOpen(false)
                }}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={clearFilters}>
            <X className='mr-2 h-4 w-4' />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

export default CommandBar