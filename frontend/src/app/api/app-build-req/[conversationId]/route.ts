import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

type Props = {
    params: Promise<{
        conversationId: string;
    }>;
};

export async function POST(
    request: Request,
    { params }: Props
) {
    try {
        const { conversationId } = await params;

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return Response.json(
                {
                    success: false,
                    message: "Please login",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { query } = body;

        console.log("Query:", query);
        console.log("Conversation ID:", conversationId);

        if (!query?.trim()) {
            return Response.json(
                {
                    success: false,
                    message: "Please enter your query",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // CHECK CONVERSATION
        // ==========================================

        let conversation =
            await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
                },
            });

        console.log(
            "CheckConversation:",
            conversation
        );

        // ==========================================
        // CREATE CONVERSATION IF NOT EXISTS
        // ==========================================

        if (!conversation) {
            conversation =
                await prisma.conversation.create({
                    data: {
                        id: conversationId,
                        userId: Number(session.user.id),
                        title: query,
                    },
                });

            console.log(
                "Created Conversation:",
                conversation
            );
        }

        // ==========================================
        // SAVE USER MESSAGE
        // ==========================================

        const userChat =
            await prisma.chat.create({
                data: {
                    conversationId:
                        conversation.id,

                    role: "User",

                    text: query,
                },
            });

        console.log(
            "Created User Chat:",
            userChat
        );

        // ==========================================
        // CALL FASTAPI / CREWAI
        // ==========================================

        const agentResponse =
            await fetch(
                "http://127.0.0.1:8000/run-agent",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        query: query,
                    }),
                }
            );

        if (!agentResponse.ok) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Something went wrong while calling the agent",
                },
                { status: 500 }
            );
        }

        const data =
            await agentResponse.json();

        console.log(
            "Agent response:",
            data
        );

        // ==========================================
        // SAVE AI MESSAGE
        // ==========================================

        const aiChat =
            await prisma.chat.create({
                data: {
                    conversationId:
                        conversation.id,

                    role: "Ai",

                    text: data.result,
                },
            });

        console.log(
            "Created AI Chat:",
            aiChat
        );

        // ==========================================
        // RETURN BOTH CHATS
        // ==========================================

        return Response.json({
            success: true,

            message:
                "The software has been created",

            conversationId:
                conversation.id,

            userChat: userChat,

            aiChat: aiChat,

            result: data.result,
        });
    } catch (err) {
        console.error(
            "Error while requesting AI:",
            err
        );

        return Response.json(
            {
                success: false,
                message:
                    "Error while requesting AI to build software",
            },
            { status: 500 }
        );
    }
}