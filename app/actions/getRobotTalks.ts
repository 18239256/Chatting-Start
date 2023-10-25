import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import getRobots from "./getRobots";
import { stringify } from "querystring";
import { json } from "stream/consumers";
import { RobotTalk } from "@prisma/client";

const getRobotTalks = async () => {
  const currentUser = await getCurrentUser();
  const robots = await getRobots();

  if (!currentUser?.id) {
    return [];
  }

  try {
    let robotTalks : RobotTalk[] = [];
    robots.forEach(async (robot)=>{
            let talks = await prisma.robotTalk.findMany({
            orderBy: {
              createdAt: 'desc',
            },
            where:  {
                robotId: robot.id
            },
            include: {
              robot: true,
              sender: true,
            }
          });
          robotTalks = robotTalks.concat(talks);
    });

    return robotTalks;

  } catch (error: any) {
    return [];
  }
};

export default getRobotTalks;