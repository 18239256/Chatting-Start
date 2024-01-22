import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      KnowledgeId,
      displayName,
      description,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updateKnowledgeBase = await prisma.knowledge.update({
      where: {
        id: KnowledgeId,
      },
      data: {
        displayName,
        description,
      },
    })
    
    return NextResponse.json(updateKnowledgeBase);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}