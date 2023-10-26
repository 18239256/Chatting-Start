import prisma from "@/app/libs/prismadb";

const getRobotTemplates = async () => {

    try {
        const robots = await prisma.robotTemplate.findMany({
        });

        return robots;
    } catch (error: any) {
        return [];
    }
};

export default getRobotTemplates;