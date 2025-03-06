import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { scanFolder } from "~/utils/scanFolder";
import { Prisma } from "@prisma/client";

export const folderRouter = createTRPCRouter({
  addFolderToDatabase: publicProcedure
    .input(z.object({ folderPath: z.string(), }))
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.db.folder.create({
        data: {
          folderPath: input.folderPath,
        }
      })

      return folder
    }),

  scanFolder: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
        const folder = await ctx.db.folder.findUnique({
          where: {
            id: input.id
          },
        })
        if (folder?.folderPath) {
          await scanFolder(folder, folder.folderPath, ctx.db)
          //update last scanned at?
          return true
        } else {
          return false
        }
    }),
})
