import axios from "axios";
import { OPENAIFastAPIKBParamType, OPENAIFastAPIParamType } from "../types";
import { Robot, RobotMask, RobotTemplate } from "@prisma/client";

const getEmbedRobotAnswer = async (
    robot: Robot & {robotTemp: RobotTemplate, mask: RobotMask},
    message: string,
) => {
    try {

        let allMessages: any[] = [];        
        allMessages.push({
            role : 'user',
            content: message
        });

        //Insert mask infor into message history
        allMessages.splice(0, 0, {
            role: 'system',
            content: robot.mask.content || ''
        });

        let reply: any ={};
        
        if (robot.robotTemp.knowledgeAbility) {
            const AIParam: OPENAIFastAPIKBParamType = {
                query: message,
                knowledge_base_name: robot.knowledgeBaseName || "",
                model_name: "chatglm2-6b",
                history: allMessages,
                temperature: robot.temperature || 0.7,
                top_k: robot.topK || 3,
                stream: false,
                local_doc_url: false,
                score_threshold: 1,
            }

            console.log('AIParam', AIParam);

            await axios.post(robot.robotTemp.apiUrl, AIParam).then((callback) => {
                if (callback.status === 200)
                    reply = callback.data;
            }).catch((err) => {
                console.error('err', err);
            });

        } else {

            console.log('<==Embed: fastchat messages==>\n', allMessages);

            const AIParam: OPENAIFastAPIParamType = {
                model: "chatglm2-6b",
                messages: allMessages,
                temperature: robot.temperature || 0.7,
                n: robot.historyRound || 1,
                max_tokens: 1024,
                stop: [],
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0
            }

            if (robot) {
                await axios.post(robot.robotTemp.apiUrl, AIParam).then((callback) => {
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

export default getEmbedRobotAnswer;