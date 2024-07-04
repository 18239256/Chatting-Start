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
      id,
      isTextMessage,
      message,
      fileName,
      issuedAt,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = await prisma.wXIssueMessages.update({
      where: {
        id: id
      },
      data: {
        isTextMessage,
        message,
        fileName,
        issuedAt,
      },
    });

    return NextResponse.json(result);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}