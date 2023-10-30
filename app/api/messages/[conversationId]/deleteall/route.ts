import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from '@/app/libs/pusher'
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const {
      conversationId
    } = params;

    
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log(conversationId);
    const {count} = await prisma.message.deleteMany({
        where: {
          conversationId: conversationId
        }
      });

    // Update last message seen
    await pusherServer.trigger(conversationId!, 'message:update', {});

    return new NextResponse(`Successfully delete ${count} message(s).`);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_DELETE_ALL')
    return new NextResponse('Error', { status: 500 });
  }
}