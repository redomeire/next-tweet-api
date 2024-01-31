import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const authorization = request.headers.get("Authorization")
    if (authorization === null) {
        return NextResponse.json({
            error: "unauthorized operation"
        }, {
            status: 401
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/tweet/:path*', '/api/auth/logout',],
}
