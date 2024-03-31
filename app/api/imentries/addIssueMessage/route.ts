import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { randomBytes } from "crypto";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
        recipientId,
        message,
        fileName,
        issuedAt,
        isTextMessage,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newWX = await prisma.wXIssueMessages.create({
        data: {
            message,
            fileName,
            issuedAt,
            isTextMessage,
            recipient:{
                connect:{
                    id: recipientId,
                }
            }
        }
    });

    return NextResponse.json(newWX);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}