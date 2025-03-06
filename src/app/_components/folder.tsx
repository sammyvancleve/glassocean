"use client"

import { FolderPlus } from "lucide-react"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

import { api } from "~/trpc/react"

export function FolderAdder() {
  const utils = api.useUtils()
  const addFolder = api.folder.addFolderToDatabase.useMutation()
  const scanFolder = api.folder.scanFolder.useMutation()
  const [folderPath, setFolderPath] = useState<string>('')

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const folder = await addFolder.mutateAsync({folderPath})
          const test = await scanFolder.mutate({id: folder.id})
        }}
        className="flex flex-col gap-2"
      >
        <Input type="text" value={folderPath} onChange={(e) => setFolderPath(e.target.value)}/>
        <Button type="submit"><FolderPlus /> Add Folder</Button>
      </form>
    </div>
  )
}
