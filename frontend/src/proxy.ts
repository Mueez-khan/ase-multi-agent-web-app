import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from "next-auth/next";
import  { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {

    // const token = await getToken({req : request})
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("token" , token)

    const session = await getServerSession(authOptions);

    console.log("token" , token)

    const url = request.nextUrl;

    const isAuthPage = url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/sign-in')

    const isChatPage = url.pathname.startsWith("/conversations") || url.pathname.startsWith("/conversation")


    if(token && isAuthPage){
        return NextResponse.redirect(new URL('/', request.url))

    }

    if(!token && isChatPage){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    


    return NextResponse.next()
}


export const config = {
     matcher: [
    '/sign-in',
    '/sign-up',
    '/conversations',
    '/conversation/:path*'
  ]
}