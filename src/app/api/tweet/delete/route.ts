import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { zfd } from "zod-form-data";

export async function DELETE(request: NextRequest) {
    try {
        const schema = zfd.formData({
            id: zfd.text()
        })
        const formData = schema.parse(await request.formData())

        const { id } = formData

        const foundTweet = await prisma.tweet.delete({
            where: {
                id
            }
        })

        if (foundTweet === null) {
            return NextResponse.json({
                error: "tweet not found",
            }, {
                status: 404
            })
        }

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

        return NextResponse.json({
            error: errorMessage
        }, {
            status: errorStatus
        })
    }
}
