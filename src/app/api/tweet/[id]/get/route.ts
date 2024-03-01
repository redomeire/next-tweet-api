import { getCorsHeaders } from "@/handler";
import { prisma } from "@/prisma/client";
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const authorization = request.headers.get("Authorization")

    if(authorization === null) 
            return NextResponse.json({ error: "Unauthorized operation" }, { status: 401 })
        
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
