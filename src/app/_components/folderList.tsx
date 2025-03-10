'use client'

import { ImageDown, RefreshCcw, } from 'lucide-react'
import React from 'react'
import { Button, } from '~/components/ui/button'

import { api, } from '~/trpc/react'

const FolderList: React.FC = React.memo(() => {
  const { data: folders, } = api.folder.getFolders.useQuery()
  const scanFolder = api.folder.scanFolder.useMutation()
  const preview = api.folder.generateFolderPreviews.useMutation()

  const onRescanClick = (id: number) => {
    scanFolder.mutate({id: id,})
  }

  const generatePreviews = (id: number) => {
    preview.mutate({id: id,})
  }

  return (
    <div className='w-1/2 text-sm'>
      {folders && folders.length > 0 ? (
        <ul>
          {folders.map((folder) => (
            <li key={folder.id}>{folder.folderPath} 
              <Button onClick={() => onRescanClick(folder.id)}><RefreshCcw /></Button>
              <Button onClick={() => generatePreviews(folder.id)}><ImageDown /></Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No folders available</p>
      )}
    </div>
  )
}
)

export default FolderList