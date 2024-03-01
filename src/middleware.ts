import { NextResponse, NextRequest } from 'next/server'
import * as jose from "jose"

export async function middleware(request: NextRequest) {
  if(request.nextUrl.pathname.startsWith('/api/tweet')) {
    const authorization = request.headers.get("Authorization")
  
    if (authorization === null) {
      return NextResponse.json({
        error: "Unauthorized operation"
      }, {
        status: 401
      })
    }
  
    const token = authorization.replace("Bearer ", '')
    const secret = new TextEncoder().encode(process.env.SECRET_KEY ?? "")
  
    try {
      const isValid = await jose.jwtVerify(token, secret)
      if (!isValid) throw new Error("Unauthorized operation")
    }
    catch (error: any) {
      return NextResponse.json({
        error: error.message
      }, {
        status: 401
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}
