import { prisma } from "@/prisma/client";
import getPayloadFromHeader from "@/utils/getPayloadFromHeader";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        if (id === null) 
            return NextResponse.json({ error: "id not provided" }, { status: 400 })

        const payload = await getPayloadFromHeader(request.headers)
        const foundTweet = await prisma.tweet.findFirst({
            where: {
                id,
                userId: payload.id as number
            }
        })

        if (foundTweet === null)
            return NextResponse.json({ error: "tweet not found" }, { status: 404 })

        return NextResponse.json({
            message: "success get tweet",
            data: foundTweet
        }, {
            status: 200
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
