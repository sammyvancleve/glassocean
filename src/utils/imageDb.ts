import { Prisma, PrismaClient } from "@prisma/client";

export const writeSingleImageToDatabase = async (image: Prisma.ImageCreateInput, db: PrismaClient) => {
    try {
        if (image) {
            await db.image.upsert({
                where: {
                    hash: image.hash
                },
                create: {
                    ...image
                },
                update: {}
            })
        } 
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