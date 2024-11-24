import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware"

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    //const url = req.nextUrl
    
    // if(token && (
    //     url.pathname =='/login'||
    //     url.pathname == '/register'
    // )){
    //     return NextResponse.redirect(new URL("/chats", req.url));
    // }
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/chats", "/","/group","/profile"],
};
