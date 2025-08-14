import { createTRPCRouter, publicProcedure, } from '~/server/api/trpc'
import { z, } from 'zod'

const ModelCursorSchema = z.object({ id: z.number(), })

export const modelRouter = createTRPCRouter({
  getModelsByCursor: publicProcedure
    .input(z.object({ take: z.number(), cursor: ModelCursorSchema.optional(), }))
    .query(async ({ ctx, input, }) => {
      const models = await ctx.db.model.findMany({
        orderBy: { id: 'asc', },
        take: input.take,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor.id, } : undefined,
        where: { type: 'main', },
      })
      return models
    }),

  getLorasByCursor: publicProcedure
    .input(z.object({ take: z.number(), cursor: ModelCursorSchema.optional(), }))
    .query(async ({ ctx, input, }) => {
      const models = await ctx.db.model.findMany({
        orderBy: { id: 'asc', },
        take: input.take,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor.id, } : undefined,
        where: { type: 'lora', },
      })
      return models
    }),
})