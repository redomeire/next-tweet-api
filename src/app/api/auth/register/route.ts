import { UserSchema } from "@/models/user"
import { prisma } from "@/prisma/client"
import { customErrorMap } from "@/utils/error/errorMapper"
import argon from "argon2"
import { NextRequest, NextResponse } from "next/server"

/**
 *
 * @param origin
 * @returns
 */
const getCorsHeaders = (origin: string) => {
    // Default options
    const headers = {
      "Access-Control-Allow-Methods": `${process.env.ALLOWED_METHODS}`,
      "Access-Control-Allow-Headers": `${process.env.ALLOWED_HEADERS}`,
      "Access-Control-Allow-Origin": `${process.env.DOMAIN_URL}`,
    };
  
    // If no allowed origin is set to default server origin
    if (!process.env.ALLOWED_ORIGIN || !origin) return headers;
  
    // If allowed origin is set, check if origin is in allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");
  
    // Validate server origin
    if (allowedOrigins.includes("*")) {
      headers["Access-Control-Allow-Origin"] = "*";
    } else if (allowedOrigins.includes(origin)) {
      headers["Access-Control-Allow-Origin"] = origin;
    }
  
    // Return result
    return headers;
  };

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

export async function POST(request: Request) {
    try {
        const response = UserSchema.safeParse(await request.json(), {
            errorMap: customErrorMap
        })

        if (!response.success) {
            return NextResponse.json({ error: response.error.flatten().fieldErrors }, {
                status: 400
            })
        }

        const foundUser = await prisma.user.findFirst({
            where: {
                email: response.data.email
            }
        })

        if (foundUser !== null) {
            return NextResponse.json({
                status: 400,
                message: "user existed before"
            }, { status: 400 })
        }

        const hashedPassword = await argon.hash(response.data.password)

        const newUser = await prisma.user.create({
            data: {
                email: response.data.email,
                password: hashedPassword
            }
        })

        return NextResponse.json({
            message: "success create new user",
            data: newUser
        }, {
            status: 200,
            headers: getCorsHeaders(request.headers.get("origin") ?? ""),
        })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
