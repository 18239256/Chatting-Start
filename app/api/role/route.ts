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
      name,
      description,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newRole = await prisma.role.create({
        data: {
            name: name,
            description :  description,
        }
    });

    return NextResponse.json(newRole);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}