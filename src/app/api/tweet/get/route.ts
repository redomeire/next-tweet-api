import { TweetSchema } from "@/models/tweet"
import { prisma } from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get("userId")

        if (userId === null) {
            return NextResponse.json({
                error: "user not found"
            }, {
                status: 404
            })
        }

        const tweets = await prisma.tweet.findMany({
            where: {
                userId: parseInt(userId)
            }
        })

        if (tweets.length === 0) {
            return NextResponse.json({
                error: "tweet not found"
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            message: "success found tweets",
            data: tweets
        }, {
            status: 200
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, {
            status: 500
        })
    }
}
