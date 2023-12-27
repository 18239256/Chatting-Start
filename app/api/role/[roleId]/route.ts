import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  roleId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { roleId: roleId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingRole = await prisma.role.findUnique({
      where: {
        id: roleId
      }
    });

    if (!existingRole) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedRole = await prisma.role.deleteMany({
      where: {
        id: roleId
      },
    });

    existingRole.assignIds.forEach((userId) => {
        //清除每一个授权用户的角色ID
        const result = prisma.user.update({
          where: {
            id: userId,
          },
          data:{
            assignRole:{
              deleteMany: [{id: roleId}],
            }
          },
          include:{
            assignRole: true,
          },
        })
        .then(()=>{console.log('deleted userId', userId)})
        .catch((e)=>{
          console.error('remove role from user error: ', e);
        });
    });

    return NextResponse.json(deletedRole)
  } catch (error) {
    return NextResponse.json(null);
  }
}