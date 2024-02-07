import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function DELETE(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      robotUserId
    } = body;

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    // 确认userId是否有效
    const existingRobotUser = await prisma.user.findUnique({
      where: {
        id: robotUserId
      },
    });

    if (!existingRobotUser) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // 删除用户关联的所有conversations
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        userIds: {
          hasSome: [robotUserId]
        },
      },
    });

    //删除机器人用户，关联机器人配置数据会自动被prisma清理
    const deletedRobotUser = await prisma.user.delete({
      where: {
        id: robotUserId,
      },
    }).catch((e) => {
      console.log('delete user error: ', e);
    });

    return NextResponse.json(deletedRobotUser)
  } catch (error) {
    return NextResponse.json(null);
  }
}