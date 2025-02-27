import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { FolderAdder } from "./_components/folder";
import { api, HydrateClient } from "~/trpc/server";

import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button";

import { Folder, FolderPlus } from 'lucide-react';

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  const images = await api.image.getLatestImagesByCursor({take: 10})
  console.log('images WWWWW', images)
  const firstImage = await api.image.getLatestImage()

  // const scanFunc = async () => {
  //   const folder = await add.mutateAsync({folderPath: '/Users/sammyvancleve/Documents/testfolder'})
  //   const lol = await scan.mutate({id: folder.id})
  // }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {/* <Input type="text"/>
            <Button><FolderPlus /> Add Folder</Button> */}
            {images ? (<img src={firstImage?.imageUrl}></img>) : <></>}
            <FolderAdder />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
