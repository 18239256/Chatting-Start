import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

//获得所有非机器人用户，且当前用用排除在外
const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: session.user.email
        },
        isRobot: true //此处可能室prisma的bug，前面的NOT好像作用于这里
      }
    });
    
    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;