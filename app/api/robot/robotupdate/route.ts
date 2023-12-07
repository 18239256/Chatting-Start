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
      robotId,
      temperature,
      historyRound,
      model,
      robotTempId,
      maskId,
      topK,
      isShared
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updateRobot = await prisma.robot.update({
      where: {
        id: robotId,
      },
      data: {
        temperature,
        historyRound,
        model,
        robotTempId,
        maskId,
        topK,
        isShared
      },
    })
    
    return NextResponse.json(updateRobot);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}