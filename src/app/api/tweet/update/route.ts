import { TweetSchema } from "@/models/tweet";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const formData = TweetSchema.parse(await request.formData())
        const { title, description, id } = formData

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
        return NextResponse.json({
            message: JSON.parse(error.message) || "error update tweet"
        }, {
            status: 500
        })
    }
}
