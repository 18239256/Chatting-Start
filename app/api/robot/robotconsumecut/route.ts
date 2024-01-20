import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { RMQC } from "@/app/libs/RMQClient";

export async function POST(
    request: Request,
) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();

        const {
            robotId,
        } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        //Get robot data via robotId
        const robot = await prisma.robot.findUnique({
            where: {
                id: robotId,
            },
            include: {
                user: true,
            }
        });

        if (!robot) {
            return new NextResponse('Invalid robot ID', { status: 400 });
        };

        //Remove related conversation
        const existingConversation = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                      userIds: {
                        equals: [currentUser.id, robot.userId]
                      }
                    },
                    {
                      userIds: {
                        equals: [robot.userId, currentUser.id]
                      }
                    }
                  ]
            },
            select:{
                id:true,
                name:true,
                isGroup:true,
            }
        });

        if (!existingConversation) {
            return new NextResponse('Invalid conversation ID', { status: 400 });
        }

        const deletedConversation = await prisma.conversation.delete({
            where:{
                id: existingConversation[0].id
            },
        });

        if(!deletedConversation){
            return new NextResponse('Delete conversation failed', { status: 400 });
        }

        //Disconnect current user's sharedRobotIds data
        const updateUser = await prisma.user.update({
            where:{
                id: currentUser.id,
            },
            data:{
                shareRobots:{
                    disconnect:{id: robotId}
                }
            }
        });

        RMQC.publish(currentUser.email, 'conversation:remove', existingConversation[0]);

        return NextResponse.json(deletedConversation);
    } catch (error) {
        return NextResponse.json(null);
    }
}