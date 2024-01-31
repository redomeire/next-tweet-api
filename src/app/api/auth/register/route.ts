import { prisma } from "@/prisma/client"
import argon from "argon2"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()

        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const foundUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (foundUser !== null) {
            return NextResponse.json({
                status: 400,
                message: "user existed before"
            }, { status: 400 })
        }

        const hashedPassword = await argon.hash(password)

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        return NextResponse.json({
            status: 200,
            message: "success create new user",
            data: newUser
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            status: 500,
            message: "error occured"
        }, { status: 500 })
    }
}
