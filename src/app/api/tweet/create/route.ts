import { TweetSchema } from "@/models/tweet"
import { prisma } from "@/prisma/client";
import getPayloadFromHeader from "@/utils/getPayloadFromHeader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { title, description } = TweetSchema.parse(await request.formData())
        const payload = await getPayloadFromHeader(request.headers)
        
        const tweet = await prisma.tweet.create({
            data: {
                title,
                description,
                userId: payload.id as number
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
