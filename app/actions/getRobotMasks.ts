import prisma from "@/app/libs/prismadb";

const getRobotMasks = async () => {

    try {
        const robotMasks = await prisma.robotMask.findMany({
        });

        return robotMasks;
    } catch (error: any) {
        return [];
    }
};

export default getRobotMasks;