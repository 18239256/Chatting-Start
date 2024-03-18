import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import robotmarket from "@/app/robotmarket/page";

export async function POST(
  request: Request,
) {
  try {

    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      id,
      name,
      alias,
      robotId,
      expired,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let data = null;
    if (robotId) {
      if (robotId === "diconnect") {
        data = {
          name,
          alias,
          expired,
          robot: {
            disconnect: true,
          },
        };
      } else {
        data = {
          name,
          alias,
          expired,
          robot: {
            connect: {
              id: robotId,
            }
          },
        };
      }
    } else {
      data = {
        name,
        alias,
        expired,
      };
    }

    const result = await prisma.wXContacts.update({
      where: {
        id: id
      },
      data: data,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}