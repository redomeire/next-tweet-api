import { TweetSchema } from "@/models/tweet";
import { prisma } from "@/prisma/client";
import { customErrorMap } from "@/utils/error/errorMapper";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const response = TweetSchema.safeParse(await request.json(), {
            errorMap: customErrorMap
        })

        if (!response.success)
            return NextResponse.json({ error: response.error.flatten().fieldErrors }, { status: 400 })

        const { title, description, id } = response.data

        const foundTweet = await prisma.tweet.findUnique({
            where: {
                id
            }
        })

        if (foundTweet === null)
            return NextResponse.json({ error: "tweet not found", }, { status: 404 })

        const updatedTweet = await prisma.tweet.update({
            where: {
                id
            },
            data: {
                title,
                description
            }
        })

        return NextResponse.json({
            message: "success update tweet",
            data: updatedTweet
        }, {
            status: 200
        })

    } catch (error: any) {
        console.log("error : ", error);
        return NextResponse.json({ message: error.message || "error update tweet" }, { status: 500 })
    }
}
