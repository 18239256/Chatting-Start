import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { Prisma } from "@prisma/client";

export async function POST(
  request: Request,
) {
  try {

    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      id,
      title,
      content,
      description,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = await prisma.robotMask.update({
      where: {
        id: id
      },
      data: {
        title,
        content,
        description,
      }
    });
    
    return NextResponse.json(result);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}