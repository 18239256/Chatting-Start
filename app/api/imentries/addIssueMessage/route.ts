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
        recipientIds,
        message,
        fileName,
        issuedAt,
        isTextMessage,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let newWXs:any[] = [];
    recipientIds.forEach(async (recipientId:string) => {
      const newWX = await prisma.wXIssueMessages.create({
        data: {
          message,
          fileName,
          issuedAt,
          isTextMessage,
          recipient: {
            connect: {
              id: recipientId,
            }
          }
        }
      });

      newWXs.push(newWX);
    });
    

    return NextResponse.json(newWXs);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}