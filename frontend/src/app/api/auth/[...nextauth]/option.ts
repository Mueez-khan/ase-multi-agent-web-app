import Credentials from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google";


export const authOptions : NextAuthOptions = {
    
    
    providers: [
        // Write code for google login 

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),


        Credentials({
            credentials:{
                email : {},
                password : {},
            },

            async authorize(credentials : {email : string , password : string} | undefined ) {
                if(!credentials?.email || !credentials?.password){
                    throw new Error("All fields are required")
                }

                const email = credentials.email as string
                const password = credentials.password as string

                const isUserExists = await prisma.users.findUnique({
                    where: {
                        email
                    }
                })


                if(!isUserExists ){
                    throw new Error("User does not exists with this email")
                }
                if(!isUserExists.password){
                    throw new Error("You may signIn using google")
                }

                const comparePassword = await bcrypt.compare(password , isUserExists.password)

                if(!comparePassword){
                    throw new Error("Password is invalid")
                }

                return {
                    id : isUserExists.id.toString(),
                    name : isUserExists.name,
                    email : isUserExists.email
                }
            }
        })

    ],



    session : {
        strategy : 'jwt',
        maxAge : 30 * 24 * 60 * 60
    },

    callbacks : {

        async signIn({user , account}){
            if(account?.provider === 'google'){
                console.log("User of google "  ,  user)
                console.log("Google signIn triggered for:", user.email)
                const existingAccount = await prisma.account.findUnique({
                    where : {
                        provider_providerAccountId : {
                            provider : account.provider,
                            providerAccountId : account.providerAccountId
                        }
                    },
                    include : { user : true}
                
                })

                if(existingAccount){
                    console.log("Existing account found, reusing user:", existingAccount.userId)
                    user.id = existingAccount.user.id.toString()
                    return true
                }

                let dbUser = await prisma.users.findUnique({
                    where : {
                        email : user.email!
                    }
                })

                if(!dbUser){
                    dbUser = await prisma.users.create({
                        data : {
                            email : user.email!,
                            name : user.name ?? "Unnamed"
                        }
                    })
                }
                 await prisma.account.create({
                    data: {
                        userId: dbUser.id,
                        type: account.type,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        refresh_token: account.refresh_token,
                        access_token: account.access_token,
                        expires_at: account.expires_at,
                        token_type: account.token_type,
                        scope: account.scope,
                        id_token: account.id_token,
                        session_state: account.session_state as string | undefined,
                    }

                })
                console.log("Created account record for user:", dbUser.id)
                user.id =  dbUser.id.toString()

            }
            return true
        },

        async jwt({token , user}){
            if(user){
                token.id = user.id
            }
            return token
        },

        async session({session , token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session;
        },
    },

    pages : {
        signIn : "/sign-in"
    }

}