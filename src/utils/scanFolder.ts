import path from "path"
import fs from "fs"
import { readPngMetadata } from "./pngMetadataReader"
import { Prisma, PrismaClient } from "@prisma/client"
import { writeSingleImageToDatabase } from "./imageDb"
import { filterObjectKeys } from "./min"

export type TestImageCreateInput = {
    seed: string
    prompt: string
    promptLowerCase: string
    negativePrompt?: string | null
    hash: string
    createdAt: Date | string
    imageUrl: string
    previewlUrl?: string | null
    rating?: number
    flag?: number
    model: Prisma.ModelCreateInput
    loras?: Prisma.LoraImageWeightingCreateInput[]
}

export const scanFolder = async (folder: Prisma.FolderWhereUniqueInput, folderPath: string, db: PrismaClient) => {
    const files = await fs.promises.readdir(folderPath)
    // edge case -- huge number of files?
    const promises = []
    // files.forEach(async (file) => {
    //     const filePath = path.join(folder.path, file)
    //     //scan file
    // })
    for (const file of files) {
        const filePath = path.join(folderPath, file)
        promises.push(scanFile(filePath))
    }
    console.log("HERE 1")
    const images = await Promise.all(promises)
    console.log("HERE 2")
    const imagesToWrite = images.filter(item => item !== null)
    console.log('images here', imagesToWrite)
    imagesToWrite.forEach(async image => {
        //filter unique models and connectorcreate, then connect
        //filter unique loras and connectorcreate,
        if (image) {
            let write: Prisma.ImageCreateInput = {
                ...image,
                folder: { connect: { id: folder.id } },
                model: {
                    connectOrCreate: {
                        where: { hash: image.model.hash },
                        create: { ...image.model }
                    }
                },
                loras: {
                    
                }
            }
            writeSingleImageToDatabase(write, db)
        }
    })
    //await db.image.createMany({ data: images})
    return true 
}

// const scanFile = async (filePath: string): Promise<Prisma.ImageCreateWithoutTagsInput | null> => {
//     const metadata = await readPngMetadata(filePath);
//     console.log('data', metadata);
//     return metadata ? metadata : null;
// }

const scanFile = async (filePath: string): Promise<TestImageCreateInput | null> => {
    const metadata = await readPngMetadata(filePath);
    console.log('data', metadata);
    return metadata ? metadata : null;
}
