import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcryptjs";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      name,
      image,
      password,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let data = null
    if(password && password != "") {
      data = {
        image: image,
        name: name,
        hashedPassword: await bcrypt.hash(password, 12),
      }
    } else {
      data = {
        image: image,
        name: name,
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: data,
    });

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}