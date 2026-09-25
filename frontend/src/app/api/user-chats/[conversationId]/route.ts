
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import  { authOptions } from '@/app/api/auth/[...nextauth]/option';

type Props = {
    params : Promise<{conversationId : string}>
}

export async function GET(request : Request , { params } : Props ){

    const session = await getServerSession(authOptions);
    

    try{
        const { conversationId } = await params;
        console.log("The conversation id" , conversationId)

        if(!session){
            return Response.json({
                success : false,
                message : "Please login"
            })
        }
        const user =  session?.user;
        console.log("The session user" , user)
        if(!conversationId){
            return Response.json({
            success : false,
            message : "Please provide conversation id"
        })
        }

       const checkConversation = await prisma.conversation.count({
        where : {
          
                id : conversationId,
                userId : Number(user?.id)
            
        }
       })

       console.log("CheckConversation" , checkConversation);

       if(checkConversation === 0){
        return Response.json({
            success : false,
            message : "Conversation not available"
        })
       }

       const userChats = await prisma.chat.findMany({
        where : {
            conversationId : conversationId
        },
        orderBy:{
            createdAt : "asc"
        }
       })

       console.log("Userchats userChats/conversationId " , userChats)

        return Response.json({
            success : true,
            message : "user chats successfully feteched",
            response : userChats
        })

    }
    catch(err){
        console.log("Error while feteching user chats" , err)
        return Response.json({
            success : false,
            message : "Error while feteching user chats"
        })
    }
}