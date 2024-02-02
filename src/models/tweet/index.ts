import { z } from "zod"

const TweetSchema = z.object({
    id: z.string().optional(),
    userId: z.number().optional(),
    title: z.string().min(3),
    description: z.string().min(5),
})

export { TweetSchema }
