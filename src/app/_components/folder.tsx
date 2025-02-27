"use client";

import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { api } from "~/trpc/react";

export function FolderAdder() {
//   const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  // const [name, setName] = useState("");
  const addFolder = api.folder.addFolderToDatabase.useMutation()
  const scanFolder = api.folder.scanFolder.useMutation()

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('here we go...')
          const folder = await addFolder.mutateAsync({folderPath: '/Users/sammyvancleve/Documents/testfolder'})
          const test = await scanFolder.mutate({id: folder.id})
        }}
        className="flex flex-col gap-2"
      >
        {/* <Button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        >
        </Button> */}
        <Input type="text"/>
        <Button type="submit"><FolderPlus /> Add Folder</Button>
      </form>
    </div>
  );
}
