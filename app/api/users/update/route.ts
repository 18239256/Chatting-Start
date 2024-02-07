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
      name,
      email,
      image,
      hashedPassword,
      updatedAt,
      expiredAt,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        image,
        hashedPassword,
        updatedAt,
        expiredAt,
      },
    })
    
    return NextResponse.json(updateUser);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}