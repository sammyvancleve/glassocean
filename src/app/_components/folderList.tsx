"use client"

import React from "react"

import { api } from "~/trpc/react"

const FolderList: React.FC = React.memo(() => {
// const FolderList = () => {
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
)

export default FolderList