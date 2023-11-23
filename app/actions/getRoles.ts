import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

//获得所有非机器人用户，且当前用用排除在外
const getRoles = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.role.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return users;
  } catch (error: any) {
    return [];
  }
};

export default getRoles;