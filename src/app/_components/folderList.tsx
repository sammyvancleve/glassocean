"use client"

import { FolderPlus } from "lucide-react"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

import { api } from "~/trpc/react"

const FolderList = () => {
  const { data: folders, } = api.folder.getFolders.useQuery()

  return (
    <div className="w-full max-w-xs text-sm">
      {folders && folders.length > 0 ? (
        <ul>
          {folders.map((folder) => (
            <li key={folder.id}>{folder.folderPath}</li>
          ))}
        </ul>
      ) : (
        <p>No folders available</p>
      )}
    </div>
  )
}

export default FolderList