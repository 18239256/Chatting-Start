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
      title,
      content,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newMask = await prisma.robotMask.create({
        data: {
            title,
            content,
            description:"",
        }
    });

    return NextResponse.json(newMask);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}