import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

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

    const result = await prisma.role.update({
      where:{
        id: roleId,
      },
      data:{
        assign:{
          set:[]
        }
      }
    });
    
    const deletedRole = await prisma.role.deleteMany({
      where: {
        id: roleId
      },
    });

    return NextResponse.json(deletedRole);
  } catch (error) {
    return NextResponse.json(null);
  }
}