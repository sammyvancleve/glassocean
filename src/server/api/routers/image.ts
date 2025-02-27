import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const CreatedAtCursorSchema = z.object({
  id: z.number(),
  createdAt: z.date()
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
  'clip_embed',
]);

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
  weight: z.number()
})

const FolderSchema = z.object({
  folderPath: z.string()
})

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
  getLatestImage: publicProcedure.query(async ({ ctx }) => {
    const image = await ctx.db.image.findFirst()
    return image
  }),

  getLatestImagesByCursor: publicProcedure
    .input(z.object({ take: z.number(), cursor: CreatedAtCursorSchema.optional() }))
    .query(async ({ ctx, input }) => {
      const images = await ctx.db.image.findMany({
        orderBy: { createdAt: "desc" },
        take: input.take,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor.id, createdAt: input.cursor.createdAt } : undefined,
      });

      let idForCursorPagination = null
      if (images?.length) {
        idForCursorPagination = images[images.length - 1]?.id
      }

      return { images, idForCursorPagination }
  }),

  getImagesWithExactPromptText: publicProcedure
    .input(z.object({ prompt: z.string(), negativePrompt: z.string() }))
    .query(async ({ ctx, input }) => {
      const images = await ctx.db.image.findMany({
        where: {
          prompt: {
            equals: input.prompt
          },
          negativePrompt: {
            equals: input.negativePrompt
          }
        }
      })

      return images
    }),
  
  getUserSearchByPromptText: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const images = await ctx.db.image.findMany({
        where: {
          promptLowerCase: {
            contains: input.text.toLowerCase(),
          }
        }
      })

      return images
    }),

  addImageToDatabase: publicProcedure
    .input(ImageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.image.create({
        data: {
          ...input,
          promptLowerCase : input.prompt.toLowerCase(),
          flag: 0,
          rating: 0,
          model: {
            connectOrCreate: {
              where: { hash: input.model.hash },
              create: { ...input.model }
            }
          },
          folderId: undefined,
          //excluding folderId fixes things???
          folder: {
            connect: {
              id: input.folderId
            }
          },
          loras: {
            create: input.loras.map(lora => {
              return {
                model: {
                  connectOrCreate: {
                    where: { hash: lora.model.hash },
                    create: { ...lora.model }
                  }
                },
                weight: lora.weight
              }
            })
          }
        },
      });
    }),
});
