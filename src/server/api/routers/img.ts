
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const imgRouter = createTRPCRouter({
    getImage: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
        
        return user?.image; // Return the S3 URL
    }),
});
