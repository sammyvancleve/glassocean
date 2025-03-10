'use client'

import { useState, } from 'react'
import { Button, } from '~/components/ui/button'
import { Input, } from '~/components/ui/input'

import { api, } from '~/trpc/react'
import React from 'react'
import { Box, Boxes, Folder, Images, Tag, } from 'lucide-react'

const SideBar: React.FC = React.memo(() => {

  return (
    <div className='w-full flex flex-col'>
      <Button variant='ghost' className='flex w-full bg-transparent text-slate-500 border-transparent hover:bg-slate-400/20'>
        <Images />
        Images
      </Button>
      <Button variant='ghost' className='bg-transparent text-slate-500 border-transparent hover:bg-slate-400/20'>
        <Box/>
        Models
      </Button>
      <Button variant='ghost' className='bg-transparent text-slate-500 border-transparent hover:bg-slate-400/20'>
        <Boxes />
        Loras
      </Button>
      <Button variant='ghost' className='bg-transparent text-slate-500 border-transparent hover:bg-slate-400/20'>
        <Tag />
        Tags
      </Button>
      <Button variant='ghost' className='bg-transparent text-slate-500 border-transparent hover:bg-slate-400/20'>
        <Folder />
        Folders
      </Button>
    </div>
  )
})

export default SideBar