import { TweetSchema } from "@/models/tweet"
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, title, description } = TweetSchema.parse(await request.formData())

        const tweet = await prisma.tweet.create({
            data: {
                title,
                description,
                userId
            }
        })

        return NextResponse.json({
            message: "success create new tweet",
            data: tweet
        }, {
            status: 200
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "error create new tweet",
        }, {
            status: 500
        })
    }
}
