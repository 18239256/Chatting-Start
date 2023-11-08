import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getUserById = async (
  userId: string
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }
  
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        robot: true,
      },
    });

    return user;
  } catch (error: any) {
    console.log(error, 'SERVER_ERROR')
    return null;
  }
};

export default getUserById;