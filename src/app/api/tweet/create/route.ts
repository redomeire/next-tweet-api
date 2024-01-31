import { TweetSchema } from "@/models/tweet"
import { prisma } from "@/prisma/client";

export async function POST(request: Request) {
    try {
        const { userId, title, description } = TweetSchema.parse(await request.formData())
        console.log("title : ", title);

        const tweet = await prisma.tweet.create({
            data: {
                title,
                description,
                userId
            }
        })

        return Response.json({
            status: 200,
            message: "success create new tweet",
            data: tweet
        })
    } catch (error) {
        console.error("error : ", error);
        return Response.json({
            status: 500,
            message: "error create new tweet",
        })
    }
}
