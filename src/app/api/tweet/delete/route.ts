import { getCorsHeaders } from "@/handler";
import { prisma } from "@/prisma/client";
import { customErrorMap } from "@/utils/error/errorMapper";
import getPayloadFromHeader from "@/utils/getPayloadFromHeader";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

export async function DELETE(request: NextRequest) {
    const authorization = request.headers.get("Authorization")

    if(authorization === null) 
        return NextResponse.json({ error: "Unauthorized operation" }, { status: 401 })

    try {
        const schema = z.object({
            id: z.string().min(1)
        })
        const response = schema.safeParse(await request.json(), {
            errorMap: customErrorMap
        })

        const payload = await getPayloadFromHeader(request.headers)

        if(!response.success)
            return NextResponse.json({ error: response.error.flatten().fieldErrors }, { status: 400 })

        const { id } = response.data

        const foundTweet = await prisma.tweet.delete({
            where: {
                id,
                userId: payload.id as number
            }
        })

        if (foundTweet === null)
            return NextResponse.json({ error: "tweet not found", }, { status: 404 })

        return NextResponse.json({
            message: "success delete tweet",
            data: foundTweet
        }, {
            status: 200
        })
    } catch (error: any) {
        let errorMessage = error?.message
        let errorStatus = 500

        switch (error.name) {
            case "PrismaClientKnownRequestError":
                errorMessage = "Tweet not found",
                    errorStatus = 404
                break
            case "TypeError":
                errorMessage = "id must be provided",
                    errorStatus = 400
                break
        }

        return NextResponse.json({ error: errorMessage }, { status: errorStatus })
    }
}
