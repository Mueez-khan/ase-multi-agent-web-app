
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import  { authOptions } from '@/app/api/auth/[...nextauth]/option';



export async function GET( ){

    
    
    try{
        
        const session = await getServerSession(authOptions);
        
        if(!session){
            return Response.json({
                success : false,
                message : "Please login"
            })
        }
        const user =  session?.user;
        console.log("The session user" , user)
     


       const userConverations = await prisma.conversation.findMany({
        where : {
            
            userId : Number(user?.id)
        },
        orderBy:{
            createdAt : "desc"
        }
       })

        

        return Response.json({
            success : true,
            message : "user chats successfully feteched",
            response : userConverations
        })

    }
    catch(err){
        console.log("Error while feteching user conversations" , err)
        return Response.json({
            success : false,
            message : "Error while feteching user conversations"
        })
    }
}