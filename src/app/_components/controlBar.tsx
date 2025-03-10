import { Home, } from 'lucide-react'
import * as React from 'react'
import { Button, } from '~/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, } from '~/components/ui/command'
import ModelSelector from './baseModelSelector'
import { useState, } from 'react'
  
const ControlBar: React.FC = React.memo(() => {
  const [focused, setFocused] = useState(false)

  return (
    <div className='flex h-[2rem] mb-4'>
      <Button variant='ghost' className='w-[5%]'><Home /></Button>
      <div className='group fixed flex ml-[5%] w-[55%] z-10 focus-within:z-40' onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} >
        <Command>
          <CommandInput placeholder='Search...'/>
          {focused 
            && <div>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Suggestions'>
                  <CommandItem key={'cal'}>Calendar</CommandItem>
                  <CommandItem>Search Emoji</CommandItem>
                  <CommandItem>Calculator</CommandItem>
                </CommandGroup>
                <CommandSeparator/>
                <CommandGroup heading='Settings'>
                  <CommandItem>Profile</CommandItem>
                  <CommandItem>Billing</CommandItem>
                  <CommandItem>Settings</CommandItem>
                </CommandGroup>
              </CommandList>
            </div>}
        </Command>
      </div>
      <div className='ml-[77%]'>
        <ModelSelector models={[{value: 'sd1.5', label: 'sd1.5',}, {value: 'flux.D', label: 'flux1.d',}]}/>
      </div>
    </div>
  )
})

export default ControlBar