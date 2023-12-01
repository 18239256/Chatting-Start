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
        isRobot: false, //必须放在NOT的前面
        NOT: {
          email: session.user.email
        }
      },
      include:{
        assignRole:true,
      }
    });
    
    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;