import { prisma } from "@/prisma/client"
import argon from "argon2"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        

        const foundUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (foundUser === null) {
            return NextResponse.json({
                error: "user not found"
            }, {
                status: 404
            })
        }

        if (!await isPasswordValid(foundUser.password, password)) {
            return NextResponse.json({ error: "password not valid" }, { status: 400 })
        }

        const token = jwt.sign({ email, password }, process.env.SECRET_KEY || "", {
            expiresIn: "2 days",
        })

        return NextResponse.json({
            status: 200,
            message: "success login",
            data: {
                token
            }
        })
    } catch (error) {
        return NextResponse.json({
            error,
        }, {
            status: 500
        })
    }
}

const isPasswordValid = async (hashedPassword: string, password: string) => {
    return await argon.verify(hashedPassword, password)
}
