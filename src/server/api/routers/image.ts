import { z, } from 'zod'

import { createTRPCRouter, publicProcedure, } from '~/server/api/trpc'

const CreatedAtCursorSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
})

const ModelType = z.enum([
  'main',
  'vae',
  'lora',
  'control_lora',
  'controlnet',
  't2i_adapter',
  'ip_adapter',
  'embedding',
  'onnx',
  'clip_vision',
  'spandrel_image_to_image',
  't5_encoder',
  'clip_embed'
])

const ModelBase = z.enum(['any', 'sd-1', 'sd-2', 'sd-3', 'sdxl', 'sdxl-refiner', 'flux'])

const ModelSchema = z.object({
  name: z.string(),
  key: z.string(),
  hash: z.string(),
  base: ModelBase,
  type: ModelType,
})

const LoraSchema = z.object({
  model: ModelSchema,
  weight: z.number(),
})

const FolderSchema = z.object({folderPath: z.string(),})

const ImageSchema = z.object({
  seed: z.string(),
  prompt: z.string(),
  negativePrompt: z.string().optional(),
  hash: z.string(),
  createdAt: z.date(),
  imageUrl: z.string(),
  model: ModelSchema,
  loras: LoraSchema.array(),
  folderId: z.number(),
})

export const imageRouter = createTRPCRouter({
  initialPageLoad: publicProcedure
    .input(z.object({ take: z.number(), }))
    .query(async ({ ctx, input, }) => {
      const images = await ctx.db.image.findMany({
        orderBy: { id: 'desc', },
        take: input.take,
      })
      const totalImages = await ctx.db.image.count()
      return { images, totalImages, }
    }),

  getTotalImages: publicProcedure
    .query(async ({ ctx, }) => {
      const totalImages = await ctx.db.image.count()
      return { totalImages, }
    }),

  getLatestImagesByCursor: publicProcedure
    .input(z.object({ take: z.number(), cursor: CreatedAtCursorSchema.optional(), }))
    .query(async ({ ctx, input, }) => {
      const images = await ctx.db.image.findMany({
        orderBy: { createdAt: 'desc', },
        take: input.take,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor.id, createdAt: input.cursor.createdAt, } : undefined,
        include: {
          loras: {include: {model: true,},},
          model: true,
          tags: true,
        },
      })

      let idForCursorPagination = null
      if (images?.length) {
        idForCursorPagination = images[images.length - 1]?.id
      }

      return { images, idForCursorPagination, }
    }),

  getImagesByPage: publicProcedure
    .input(z.object({
      take: z.number(), page: z.number(), filteringOn: z.string(), query: z.array(z.string()), sortBy: z.string(),
    }))
    .query(async ({ctx, input,}) => {
      const countFilter = {where: {},}
      const filter = {
        take: input.take,
        skip: input.take * (input.page - 1),
        include: {
          loras: {include: {model: true,},},
          model: true,
          tags: true,
        },
        where: {},
        orderBy: {},
      }
      switch (input.filteringOn) {
        case 'prompt':
          filter.where = {promptLowerCase: {contains: input.query[0]?.toLowerCase(),},}
          countFilter.where = {promptLowerCase: {contains: input.query[0]?.toLowerCase(),},}
          break
        case 'prompt_exact':
          filter.where = {
            prompt: {equals: input.query[0],},
            negativePrompt: {equals: input.query[1],},
          }
          countFilter.where = {
            prompt: {equals: input.query[0],},
            negativePrompt: {equals: input.query[1],},
          }
          break
        case 'model':
          filter.where = {model: {id: parseInt(input.query[0] ?? '0', 10),},}
          countFilter.where = {model: {id: parseInt(input.query[0] ?? '0', 10),},}
          break
        case 'lora': {
          const loraModelIds = input.query.map(id => parseInt(id, 10))
          filter.where = {loras: {some: {model: {id: { in: loraModelIds, },},},},}
          break
        } 
      }
      switch (input.sortBy) {
        case 'latest':
          filter.orderBy = { createdAt: 'desc', }
          break
        case 'id':
          filter.orderBy = { id: 'desc', }
          break
      }
      const images = await ctx.db.image.findMany(filter)
      const imageCount = await ctx.db.image.count(countFilter)
      return { images, imageCount, }
    }),

  getLatestImagesByPage: publicProcedure
    .input(z.object({ take: z.number(), page: z.number(), }))
    .query(async ({ ctx, input, }) => {
      const images = await ctx.db.image.findMany({
        orderBy: { id: 'desc', },
        take: input.take,
        skip: input.take * (input.page - 1),
        include: {
          loras: {include: {model: true,},},
          model: true,
          tags: true,
        },
      })
      return { images, }
    }),

  addBlurUrl: publicProcedure
    .input(z.object({ id: z.number(), blurUrl: z.string(), }))
    .mutation(async ({ ctx, input, }) => {
      const updated = await ctx.db.image.update({
        where: { id: input.id, },
        data: { blurUrl: input.blurUrl, },
      })
      
      return updated
    }),

  getImagesWithExactPromptText: publicProcedure
    .input(z.object({ prompt: z.string(), negativePrompt: z.string(), }))
    .query(async ({ ctx, input, }) => {
      const images = await ctx.db.image.findMany({
        where: {
          prompt: {equals: input.prompt,},
          negativePrompt: {equals: input.negativePrompt,},
        },
      })

      return images
    }),

  getUserSearchByPromptText: publicProcedure
    .input(z.object({ text: z.string(), }))
    .query(async ({ ctx, input, }) => {
      const images = await ctx.db.image.findMany({where: {promptLowerCase: {contains: input.text.toLowerCase(),},},})

      return images
    }),

  addImageToDatabase: publicProcedure
    .input(ImageSchema)
    .mutation(async ({ ctx, input, }) => {
      const existingImage = await ctx.db.image.findUnique({where: {hash: input.hash,},})
      if (!existingImage) {
        return ctx.db.image.create({
          data: {
            ...input,
            promptLowerCase: input.prompt.toLowerCase(),
            flag: 0,
            rating: 0,
            model: {
              connectOrCreate: {
                where: { hash: input.model.hash, },
                create: { ...input.model, },
              },
            },
            folderId: undefined,
            //excluding folderId fixes things???
            folder: {connect: {id: input.folderId,},},
            loras: {
              create: input.loras.map(lora => {
                return {
                  model: {
                    connectOrCreate: {
                      where: { hash: lora.model.hash, },
                      create: { ...lora.model, },
                    },
                  },
                  weight: lora.weight,
                }
              }),
            },
          },
        })
      } else {
        return null
      }
    }),
})
