import { Prisma, PrismaClient } from "@prisma/client";

export const writeSingleImageToDatabase = async (image: Prisma.ImageCreateInput, db: PrismaClient) => {
    console.log('wtf', image)
    try {
        console.log('trying to write...')
        await db.image.create({data: image})
    } catch (e) {
        console.error(e)
    }
}

// export const writeSingleModelToDatabase = async (model: Prisma.ModelCreateInput, db: PrismaClient) => {
//     try {
//         await db.model.
//     } catch (e) {
//         console.error(e)
//     }
// }