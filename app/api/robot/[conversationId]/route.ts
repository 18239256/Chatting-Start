import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { RMQC } from "@/app/libs/RMQClient";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: {
          select:{
            id: true,
            name: true,
            email: true,
            isRobot: true
          }
        }
      }
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        RMQC.publish(user.email, 'conversation:remove', existingConversation);
      }

      if(user.isRobot){
        //机器人用户，关联机器人配置数据会自动被prisma清理
        const deletedRobotUser = prisma.user.delete({
          where: {
            id: user.id,
          },
        }).catch((e)=>{
          console.log('delete user error: ', e);
        });
      }
    });

    return NextResponse.json(deletedConversation)
  } catch (error) {
    return NextResponse.json(null);
  }
}