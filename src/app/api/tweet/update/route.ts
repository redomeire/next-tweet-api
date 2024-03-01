import { getCorsHeaders } from "@/handler";
import { TweetSchema } from "@/models/tweet";
import { prisma } from "@/prisma/client";
import { customErrorMap } from "@/utils/error/errorMapper";
import getPayloadFromHeader from "@/utils/getPayloadFromHeader";
import { NextRequest, NextResponse } from "next/server";

export const OPTIONS = async (request: NextRequest) => {
    // Return Response
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: getCorsHeaders(request.headers.get("origin") ?? ""),
        }
    );
};

export async function PUT(request: NextRequest) {
    const authorization = request.headers.get("Authorization")

    if(authorization === null) 
        return NextResponse.json({ error: "Unauthorized operation" }, { status: 401 })

    try {
        const response = TweetSchema.safeParse(await request.json(), {
            errorMap: customErrorMap
        })

        const payload = await getPayloadFromHeader(request.headers)

        if (!response.success)
            return NextResponse.json({ error: response.error.flatten().fieldErrors }, { status: 400 })

        const { title, description, id } = response.data

        const foundTweet = await prisma.tweet.findUnique({
            where: {
                id,
                userId: payload.id as number
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
