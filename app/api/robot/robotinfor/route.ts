import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();

        const {
            robotId,
        } = body;

        //Get robot data via robotId
        const robot = await prisma.robot.findUnique({
            where: {
                id: robotId,
            },
            include:{
                robotTemp:true,
                mask:true,
            }
        });

        if (!robot) {
            return new NextResponse('Invalid robot ID', { status: 400 });
        };

        return NextResponse.json(robot);
    } catch (error) {
        return NextResponse.json(null);
    }
}