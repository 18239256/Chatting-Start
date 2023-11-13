import getCurrentUser from "./getCurrentUser";
import prisma from "@/app/libs/prismadb";
import axios from "axios";
import getMessages from "./getMessages";
import { OPENAIFastAPIKBParamType, OPENAIFastAPIParamType } from "../types";

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

        //Insert mask infor into message history
        allMessages.splice(0, 0, {
            role: 'system',
            content: robotUserFull?.robot?.mask?.content || ''
        });

        let reply: any ={};
        
        if (robotUserFull?.robot?.robotTemp.knowledgeAbility) {
            const AIParam: OPENAIFastAPIKBParamType = {
                query: message,
                knowledge_base_name: robotUserFull?.robot?.knowledgeBaseName || "John",
                model_name: "chatglm2-6b",
                history: allMessages,
                temperature: robotUserFull?.robot?.temperature || 0.7,
                top_k: robotUserFull?.robot?.topK || 3,
                stream: false,
                local_doc_url: false,
                score_threshold: 1,
            }

            console.log('AIParam', AIParam);

            await axios.post(robotUserFull.robot.robotTemp.apiUrl, AIParam).then((callback) => {
                if (callback.status === 200)
                    reply = callback.data;
            }).catch((err) => {
                console.error('err', err);
            });

        } else {

            

            if (allMessages.slice(-1)[0].content !== message)
                allMessages.push({
                    role: 'user',
                    content: message
                });

            console.log('<==fastchat messages history==>\n', allMessages);

            const AIParam: OPENAIFastAPIParamType = {
                model: "chatglm2-6b",
                messages: allMessages,
                temperature: robotUserFull?.robot?.temperature || 0.7,
                n: robotUserFull?.robot?.historyRound || 1,
                max_tokens: 1024,
                stop: [],
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0
            }

            if (robotUserFull?.robot) {
                await axios.post(robotUserFull.robot.robotTemp.apiUrl, AIParam).then((callback) => {
                    if (callback.status === 200)
                        reply = { answer: callback.data };
                })
            }
        }

        console.log('AI replies: ', reply);

        return reply;

    } catch (error: any) {
        return "";
    }
};

export default getRobotAnswer;