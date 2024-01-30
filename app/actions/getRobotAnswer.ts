import getCurrentUser from "./getCurrentUser";
import prisma from "@/app/libs/prismadb";
import axios from "axios";
import getMessages from "./getMessages";
import { OPENAIFastAPIKBParamType, OPENAIFastAPIParamType, OPENAIFastAPISearchParamType } from "../types";
import getRobotAnswerBase from "./getRobotAnswerBase";

const getRobotAnswer = async (
    robotUserId: string | undefined,
    message: string,
    conversationId: string | undefined =''
) => {
    try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser?.id) {
            return "";
        }
        
        const messages = await getMessages(conversationId);

        const robotUserFull = await prisma.user.findUnique({
            where: {
                id: robotUserId,
            },
            include:{
                robot: {
                    include:{
                        robotTemp: true,
                        mask: true,
                    }
                }
            }
        });
        let allMessages: any[] = [];        
        let historyRound:number = robotUserFull?.robot?.historyRound || 6;
        for (let index = (messages.length>historyRound? messages.length - historyRound : 0); index < messages.length; index++) {
            const msg = messages[index];
            if(msg.isLoading) continue;
            if(msg.sender.isRobot)
            {
                allMessages.push({
                    role : 'assistant',
                    content: msg.body? msg.body:""
                })
            }
            else{
                allMessages.push({
                    role : 'user',
                    content: msg.body? msg.body:""
                })
            }
        }

        return getRobotAnswerBase(robotUserFull?.robot, message, allMessages);

    } catch (error: any) {
        return "";
    }
};

export default getRobotAnswer;