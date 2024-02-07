import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { RMQC } from "@/app/libs/RMQClient";
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
      conversationId,
      updateMessageId,
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    //get robot user with its full configuration
    const conversation = await getConversationById(conversationId);
    
    const robotUser = conversation?.users.find((currentValue) => {
        return currentValue.id !== currentUser.id;
    })

    let retMessage:{answer:string, docs?:[]};
    if(null !== robotUser?.expiredAt && robotUser?.expiredAt! < new Date()){
      retMessage = {
        answer:"机器人使用期限已经到了!",
    }}else    
      retMessage = await getRobotAnswer(robotUser?.id, message, conversation?.id);
    
    const updateMessage = await prisma.message.update({
      where:{
        id: updateMessageId,
      },
      include: {
        // seen: true,
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
        isLoading: false,
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
            id: updateMessage.id
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

    RMQC.publish(conversationId, 'message:update', updateMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      RMQC.publish(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    });

    return NextResponse.json(updateMessage)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}