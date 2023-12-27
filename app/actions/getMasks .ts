import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getMasks = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return null;
  }

  try {
    const robots = await prisma.robotMask.findMany({
      orderBy: {
        createdAt: 'desc'
      },      
    });
    
    return robots;
  } catch (error: any) {
    return [];
  }
};

export default getMasks;