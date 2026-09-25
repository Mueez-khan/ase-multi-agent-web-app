import { authOptions } from "./option"
import NextAuth from "next-auth";



console.log("The handler" , {authOptions})

const handler = NextAuth(authOptions);

export {
    handler as GET ,
    handler as POST
}