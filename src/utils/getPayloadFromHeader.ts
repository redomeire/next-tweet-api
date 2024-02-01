import * as jose from "jose"

export default async function getPayloadFromHeader(headers: Request['headers']) {
    const authorization = headers.get("Authorization")
    const bearerToken = authorization?.replace("Bearer ", "")
    
    if (bearerToken === undefined) throw new Error("token undefined")

    const secret = new TextEncoder().encode(process.env.SECRET_KEY || "")
    const verifiedToken = await jose.jwtVerify(bearerToken, secret)

    return verifiedToken.payload
}
