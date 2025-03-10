'use client'

import { FolderPlus, } from 'lucide-react'
import { useState, } from 'react'
import { Button, } from '~/components/ui/button'
import { Input, } from '~/components/ui/input'

import { api, } from '~/trpc/react'
import FolderList from './folderList'
import React from 'react'

const FolderAdder: React.FC = React.memo(() => {
  const addFolder = api.folder.addFolderToDatabase.useMutation()
  const scanFolder = api.folder.scanFolder.useMutation()
  const [folderPath, setFolderPath] = useState<string>('')

  return (
    <div className='flex flex-col px-2'>
      <FolderList />
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const folder = await addFolder.mutateAsync({folderPath,})
          if (folder) {await scanFolder.mutate({id: folder.id,})}
        }}
        className='flex gap-2 w-1/4'
      >
        <Input type='text' value={folderPath} onChange={(e) => setFolderPath(e.target.value)}/>
        <Button type='submit'><FolderPlus /> Add Folder</Button>
      </form>
    </div>
  )
})

export default FolderAdder