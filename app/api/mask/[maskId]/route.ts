import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

interface IParams {
  maskId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { maskId: maskId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingMask = await prisma.robotMask.findUnique({
      where: {
        id: maskId
      }
    });

    if (!existingMask) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedMask = await prisma.robotMask.deleteMany({
      where: {
        id: maskId
      },
    });

    return NextResponse.json(deletedMask);
  } catch (error) {
    return NextResponse.json(null);
  }
}