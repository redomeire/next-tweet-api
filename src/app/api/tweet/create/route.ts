import { getCorsHeaders } from "@/handler";
import { TweetSchema } from "@/models/tweet"
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

export async function POST(request: NextRequest) {
    const authorization = request.headers.get("Authorization")

    if(authorization === null) 
        return NextResponse.json({ error: "Unauthorized operation" }, { status: 401 })

    try {
        const response = TweetSchema.safeParse(await request.json(), {
            errorMap: customErrorMap,
        })

        const payload = await getPayloadFromHeader(request.headers)

        if (!response.success) {
            return NextResponse.json({
                error: response.error.flatten().fieldErrors,
            }, {
                status: 400
            })
        }

        const tweet = await prisma.tweet.create({
            data: {
                title: response.data.title,
                description: response.data.description,
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
        if (error instanceof z.ZodError) {
            console.log("error zod : ", error);
        }
        return NextResponse.json({
            error: error.message || "error create new tweet",
        }, {
            status: 500
        })
    }
}
