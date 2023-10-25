import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getRobots = async () => {
    const currentUser = await getCurrentUser();

    try {
        const robots = await prisma.robot.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                userId: currentUser?.id
      }
        });

        return robots;
    } catch (error: any) {
        return [];
    }
};

export default getRobots;