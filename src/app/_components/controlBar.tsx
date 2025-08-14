import { Home, Tag, Image, Box, Boxes, } from 'lucide-react'
import * as React from 'react'
import { Button, } from '~/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, } from '~/components/ui/command'
import ModelSelector from './baseModelSelector'
import { useState, } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '~/components/ui/select'
import { Input, } from '~/components/ui/input'

interface ControlBarProps {
  onQuery: React.Dispatch<React.SetStateAction<Array<string>>>,
  onFilterChange: React.Dispatch<React.SetStateAction<string>>,
}

const ControlBar: React.FC<ControlBarProps> = React.memo(({ onQuery, onFilterChange, }) => {
  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const resetFilter = () => {
    setSearchInput('')
  }

  const handleSearchChange = (value: string) => {
  }

  return (
    <div className='flex h-[5rem] mb-4'>
      <Button variant='ghost' className='w-[5%]' onClick={resetFilter}><Home /></Button>
      <div className='group fixed flex ml-[5%] w-[50%] focus-within:z-40' onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} >
        <Command value={searchInput} onValueChange={handleSearchChange}>
          <CommandInput placeholder='Search...'
          />
          {focused
            && <div>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Suggestions'>
                  <CommandItem key={'images'}><Image />Images</CommandItem>
                  <CommandItem key={'models'}><Box />Models</CommandItem>
                  <CommandItem key={'loras'}><Boxes />Loras</CommandItem>
                  <CommandItem key={'tags'}><Tag />Tags</CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </CommandList>
            </div>}
        </Command>
      </div>
      <div className='ml-[60%] w-[15%]'>
        <Select onValueChange={(value) => {
          onFilterChange(value)
        }}>
          <SelectTrigger className='w-[100%]'>
            <SelectValue placeholder='Filter Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='prompt'>Prompt Text</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <ModelSelector models={[{ value: 'sd1.5', label: 'sd1.5', }, { value: 'flux.D', label: 'flux1.d', }]} />
      </div>
    </div>
  )
})

export default ControlBar