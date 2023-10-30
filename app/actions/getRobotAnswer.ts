import getCurrentUser from "./getCurrentUser";
import { User } from "@prisma/client";
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
        const messages = await getMessages(conversationId);

        let allMessages: any[] = [];
        for (let index = messages.length - 6; index < messages.length; index++) {
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
        // messages.map((msg) => {
        //     if(msg.sender.isRobot)
        //     {
        //         allMessages.push({
        //             role : 'assistant',
        //             content: msg.body
        //         })
        //     }
        //     else{
        //         allMessages.push({
        //             role : 'user',
        //             content: msg.body
        //         })
        //     }
        // })


        if (!currentUser?.id) {
            return "";
        }

        const robotUserFull = await prisma.user.findMany({
            where: {
                id: robotUserId,
            },
            include:{
                robot: {
                    include:{
                        robotTemp: true
                    }
                }
            }
        });

        let reply: string ="";
        
        const AIParam: OPENAIFastAPIParamType = {
            model: "chatglm2-6b",
            messages: allMessages,
            temperature: 0.7,
            n: 1,
            max_tokens: 1024,
            stop: [],
            stream: false,
            presence_penalty: 0,
            frequency_penalty: 0
        }

        if (robotUserFull[0].robot) {
            await axios.post(robotUserFull[0].robot?.robotTemp.apiUrl, AIParam).then((callback) => {
                if (callback.status === 200)
                    reply = callback.data;
            })
        }

        return reply;

    } catch (error: any) {
        return "";
    }
};

export default getRobotAnswer;