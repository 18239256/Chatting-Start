import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import delKnowledgeBase from "@/app/actions/LLM/delKnowledgeBase";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
        knowledgeBaseName,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ret = await delKnowledgeBase(knowledgeBaseName);

    const deleteKB = await prisma.knowledge.delete({
        where: {
            realName :  knowledgeBaseName,
        }
    });

    return NextResponse.json(deleteKB);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}