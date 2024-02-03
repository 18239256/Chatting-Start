import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {

    //查询出当前用户下的所有机器人关联用户IDs
    const robotUsersOfCurUser = await prisma.user.findUnique({
      where: {
        id: currentUser.id
      },
      select: {
        robotUsers: true
      }
    });

    // if (robotUsersOfCurUser === null) {
    //   return [];
    // }
   
    //转换机器人关联IDs为字符串数组
    let robotIds : string[] =[];
    if(robotUsersOfCurUser !== null)
      robotUsersOfCurUser.robotUsers.map((r) => {
        robotIds.push(r.id);
      });

    //增加启用分享的机器人IDs
    const shareRobots = await prisma.robot.findMany({
      where:{
        id:{
          in: currentUser.sharedRobotIds,
        }
      }
    });

    robotIds = [...robotIds,...shareRobots.map((u)=>{return u.userId})];

    if(robotIds.length === 0)
      return [];

    //根据上面的数组，查询出数组关联的所有会话
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        AND: [
          {
            userIds: {
              has: currentUser.id //包含当前用户的ID
            }
          },{
            userIds: {
              hasSome: robotIds //至少包含机器人用户ID数组中的1个或多个
            }
          },
        ]
      },
      include: {
        users: {
          include:{
            robot:true
          }
        },
        messages: {
          include: {
            sender: true,
            seen: true,
          }
        },
      }
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;