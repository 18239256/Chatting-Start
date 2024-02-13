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
      name,
      email,
      image,
      hashedPassword,
      updatedAt,
      expiredAt,
      assignRoleIds,
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

    if (assignRoleIds) {
      const resultBefore = await prisma.user.update({
        where: {
          id: id
        },
        data: {
          assignRole: {
            set: [],
          }
        }
      });

      //Connect with new assignment.
      const updateData: Prisma.UserUpdateInput =
      {
        assignRole: {
          connect: assignRoleIds.map((id: any) => ({ id: id })),
        }
      };

      //Execute update action
      const resultAfter = await prisma.user.update({
        where: {
          id: id
        },
        data: updateData
      });
    }
    
    return NextResponse.json(updateUser);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}