import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getSharedRobots = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return null;
  }

  try {
    const robots = await prisma.robot.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        isShared: true, 
        user:{
          NOT:{
            robotOwnerId: currentUser.id,
          }
        }
      },
      include:{
        consumeUsers:true,
        user:true,
      }
    });
    
    return robots;
  } catch (error: any) {
    return [];
  }
};

export default getSharedRobots;