import { NextResponse } from "next/server";

import createKnowledgeBase from "@/app/actions/LLM/createKnowledgeBase";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
        knowledgeBaseDisplayName,
        knowledgeBaseRealName,
        knowledgeBaseDesc,
        belongToUserId,
        vsType,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ret = await createKnowledgeBase(knowledgeBaseRealName, vsType);

    const newKB = await prisma.knowledge.create({
        data: {
            displayName: knowledgeBaseDisplayName,
            realName :  knowledgeBaseRealName,
            description: knowledgeBaseDesc,
            vsType: vsType,
            user:{
                connect:{
                    id: belongToUserId,
                }
            }
        }
    });

    return NextResponse.json(newKB);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}