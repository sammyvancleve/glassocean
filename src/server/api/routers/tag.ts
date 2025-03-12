import { z, } from 'zod'

import { createTRPCRouter, publicProcedure, } from '~/server/api/trpc'

export const tagRouter = createTRPCRouter({
  addTagWithImage: publicProcedure
    .input(z.object({ tagName: z.string(), imageId: z.number(),}))
    .mutation(async ({ ctx, input, }) => {
      const existingTag = await ctx.db.tag.findUnique({where: {name: input.tagName,},})
      if (!existingTag) {
        const newTag = await ctx.db.tag.create({
          data: {
            name: input.tagName,
            images: {connect: [{ id: input.imageId, }],},
          },
        })
        return newTag
      } else {
        await ctx.db.image.update({
          where: {id: input.imageId,},
          data: {tags: {connect: [{ id: existingTag.id, }],},},
        })
        return existingTag
      }
    }),
  
  getAllTags: publicProcedure
    .query(async ({ ctx, }) => {
      const tags = await ctx.db.tag.findMany()
      return tags
    }),

  addExistingTagToImage: publicProcedure
    .input(z.object({ tagId: z.number(), imageId: z.number(), }))
    .mutation(async ({ ctx, input, }) => {
      const updatedImage = await ctx.db.image.update({
        where: {id: input.imageId,},
        data: {tags: {connect: [{ id: input.tagId, }],},},
        include: {tags: true,},
      })

      return updatedImage
    }),
  
})
