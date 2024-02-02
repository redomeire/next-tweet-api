import { z } from "zod"

const UserSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(8)
})

export { UserSchema }
