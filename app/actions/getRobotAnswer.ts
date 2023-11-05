import getCurrentUser from "./getCurrentUser";
// import { User } from "@prisma/client";
import prisma from "@/app/libs/prismadb";
import axios from "axios";
import getMessages from "./getMessages";
import { OPENAIFastAPIParamType } from "../types";

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

        let allMessages: any[] = [];
        for (let index = (messages.length>6?messages.length- 6 : 0); index < messages.length; index++) {
            const msg = messages[index];
            if(msg.sender.isRobot)
            {
                allMessages.push({
                    role : 'assistant',
                    content: msg.body
                })
            }
            else{
                allMessages.push({
                    role : 'user',
                    content: msg.body
                })
            }
        }
        allMessages.push({
            role : 'user',
            content: message
        });

        const robotUserFull = await prisma.user.findUnique({
            where: {
                id: robotUserId,
            },
            include:{
                robot: {
                    include:{
                        robotTemp: true,
                        mask: true
                    }
                }
            }
        });

        //Insert mask infor into message history
        allMessages.splice(0, 0, {
            role: 'system',
            content: robotUserFull?.robot?.mask?.content
        });

        console.log('allMessages==>', allMessages);

        let reply: string ="";
        
        const AIParam: OPENAIFastAPIParamType = {
            model: "chatglm2-6b",
            messages: allMessages,
            temperature: robotUserFull?.robot?.temperature || 0.7,
            n: robotUserFull?.robot?.n || 1,
            max_tokens: 1024,
            stop: [],
            stream: false,
            presence_penalty: 0,
            frequency_penalty: 0
        }
        
        if (robotUserFull?.robot) {
            await axios.post(robotUserFull.robot.robotTemp.apiUrl, AIParam).then((callback) => {
                if (callback.status === 200)
                    reply = callback.data;
            })
        }
        console.log('reply: ', reply);

        return reply;

    } catch (error: any) {
        return "";
    }
};

export default getRobotAnswer;