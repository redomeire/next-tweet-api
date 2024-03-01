import { NextResponse, NextRequest } from 'next/server'
import * as jose from "jose"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  // add the CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', "true")
  res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

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
   return res
}

export const config = {
  matcher: ['/api/:path*']
}
