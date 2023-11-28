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
        roleId,
        assignIds
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newRole = await prisma.role.update({
        where:{
            id: roleId
        },
        data: {
            assign:{
                connect:[...assignIds.map((id:any)=>{
                    id:id
                })]
            }
        }
    });

    return NextResponse.json(newRole);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}