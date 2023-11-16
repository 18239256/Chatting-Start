import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from '@/app/libs/pusher'
import prisma from "@/app/libs/prismadb";
import getConversationById from "@/app/actions/getConversationById";
import getRobotAnswer from "@/app/actions/getRobotAnswer";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      message,
      image,
      conversationId
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    //get robot user with its full configuration
    const conversation = await getConversationById(conversationId);
    
    const robotUser = conversation?.users.find((currentValue) => {
        return currentValue.id !== currentUser.id;
    })
    
    const retMessage = await getRobotAnswer(robotUser?.id, message, conversation?.id);
    
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: {
          select:{
            id: true,
            name: true,
            email: true,
            robotOwnerId: true,
            image: true,
            robot: true,
          }
        }
      },
      data: {
        body: retMessage.answer,
        image: image,
        referenceDocs: JSON.stringify(retMessage.docs),
        conversation: {
          connect: { id: conversationId }
        },
        sender: {
          connect: { id: robotUser?.id }
        },
        seen: {
          connect: {
            id: robotUser?.id
          }
        },
      }
    });
    
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    });

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    });

    return NextResponse.json(newMessage)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}