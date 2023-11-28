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
      roleId,
      assignIds,
      channels
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    //Clear user connnects
    if (assignIds) {
      const resultBefore = await prisma.role.update({
        where: {
          id: roleId
        },
        data: {
          assign: {
            set: [],
          }
        }
      });
    }

    //Connect with new assignment.
    let updateData: Prisma.RoleUpdateInput = {};
    if (assignIds)
      updateData =
      {
        assign: {
          connect: assignIds.map((id: any) => ({ id: id })),
        }
      };

    if(channels)
      updateData.channels = channels;

    const resultAfter = await prisma.role.update({
      where: {
        id: roleId
      },
      data: updateData
    });

    return NextResponse.json(resultAfter);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}