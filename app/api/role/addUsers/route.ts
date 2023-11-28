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

    //Clear all connet before.
    const resultBefore = await prisma.role.update({
        where:{
            id: roleId
        },
        data: {
            assign:{
                set:[],
            }
        }
    });
    
    //Connect with new assignment.
    const resultAfter = await prisma.role.update({
        where:{
            id: roleId
        },
        data: {
            assign:{
                connect:assignIds.map((id:any) =>({id:id})),
            }
        }
    });

    return NextResponse.json(resultAfter);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}