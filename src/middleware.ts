import { NextResponse, NextRequest } from 'next/server'
import * as jose from "jose"
import { getCorsHeaders } from './handler';

const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  allowedMethods: (process.env?.ALLOWED_METHODS ?? "").split(","),
  allowedOrigins: (process.env?.ALLOWED_ORIGIN ?? "").split(","),
  allowedHeaders: (process.env?.ALLOWED_HEADERS ?? "").split(","),
  exposedHeaders: (process.env?.EXPOSED_HEADERS ?? "").split(","),
  maxAge: process.env?.MAX_AGE && parseInt(process.env?.MAX_AGE) || undefined, // 60 * 60 * 24 * 30, // 30 days
  credentials: process.env?.CREDENTIALS == "true",
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

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Allowed origins check
  const origin = request.headers.get('origin') ?? '';
  if (corsOptions.allowedOrigins.includes('*') || corsOptions.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Set default CORS headers
  response.headers.set("Access-Control-Allow-Credentials", corsOptions.credentials.toString());
  response.headers.set("Access-Control-Allow-Methods", corsOptions.allowedMethods.join(","));
  response.headers.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
  response.headers.set("Access-Control-Expose-Headers", corsOptions.exposedHeaders.join(","));
  response.headers.set("Access-Control-Max-Age", corsOptions.maxAge?.toString() ?? "");

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

   // Return
   return response;
}

export const config = {
  matcher: ['/api/:path*']
}
