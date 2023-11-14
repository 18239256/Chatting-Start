import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {

    const robotUsersOfCurUser = await prisma.user.findUnique({
      where: {
        id: currentUser.id
      },
      select: {
        robotUsers: true
      }
    });

    if (robotUsersOfCurUser === null) {
      return [];
    }
   
    let robotIds : string[] =[];
    robotUsersOfCurUser.robotUsers.map((r) => {
      robotIds.push(r.id);
    })

    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          hasSome: robotIds
        }
      },
      include: {
        users: {
          include:{
            robot:true
          }
        },
        messages: {
          include: {
            sender: true,
            seen: true,
          }
        },
      }
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;