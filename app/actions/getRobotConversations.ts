import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getRobotConversations = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    const robotUsersOfCurUser = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            robotOwnerId: currentUser.id
        }
    });

    if(robotUsersOfCurUser.length === 0){
        return [];
    }

    try {
        let conversations: any[] = [];
        robotUsersOfCurUser.forEach(async (robotUser) => {
            const conversation = await prisma.conversation.findMany({
                orderBy: {
                    lastMessageAt: 'desc',
                },
                where: {
                    userIds: {
                        has: currentUser.id
                    }
                },
                include: {
                    users: true,
                    messages: {
                        include: {
                            sender: true,
                            seen: true,
                        }
                    },
                }
            });
            conversations = conversations.concat(conversation);
        })

        return conversations;
    } catch (error: any) {
        return [];
    }
};

export default getRobotConversations;