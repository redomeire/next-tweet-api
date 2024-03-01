import { UserSchema } from "@/models/user"
import { prisma } from "@/prisma/client"
import { customErrorMap } from "@/utils/error/errorMapper"
import argon from "argon2"
import { NextRequest, NextResponse } from "next/server"
import * as jose from "jose"
import { getCorsHeaders } from "@/handler"

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
    try {
        const response = UserSchema.safeParse(await request.json(), {
            errorMap: customErrorMap
        })

        if (!response.success)
            return NextResponse.json({ error: response.error.flatten().fieldErrors }, {
                status: 400
            })

        const foundUser = await prisma.user.findFirst({
            where: {
                email: response.data.email
            }
        })

        if (foundUser === null) {
            return NextResponse.json({
                error: "user not found"
            }, {
                status: 404
            })
        }

        if (!await isPasswordValid(foundUser.password, response.data.password))
            return NextResponse.json({ error: "wrong password" }, { status: 400 })

        const secret = new TextEncoder().encode(process.env.SECRET_KEY ?? "")

        const token = await new jose.SignJWT({ email: response.data.email, id: foundUser.id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(secret)

        return NextResponse.json({
            message: "success login",
            data: { token, userId: foundUser.id }
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}

const isPasswordValid = async (hashedPassword: string, password: string) => {
    return await argon.verify(hashedPassword, password)
}
