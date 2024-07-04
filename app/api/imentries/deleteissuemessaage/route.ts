import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function DELETE(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      id,
    } = body;

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const deleteIssueMessage = await prisma.wXIssueMessages.delete({
      where: {
        id: id
      },
    });

    if (!deleteIssueMessage) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    return NextResponse.json(deleteIssueMessage)
  } catch (error) {
    return NextResponse.json(null);
  }
}