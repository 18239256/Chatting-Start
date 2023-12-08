import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

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
        const deletedConversation = await prisma.conversation.deleteMany({
            where:{
                AND: [
                    {
                      userIds: {
                        has: currentUser.id //包含当前用户的ID
                      }
                    },{
                      userIds: {
                        has: robot.userId //包含机器人用户ID
                      }
                    },
                  ]
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

        return NextResponse.json(deletedConversation);
    } catch (error) {
        return NextResponse.json(null);
    }
}