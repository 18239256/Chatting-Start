import { Robot, RobotMask, RobotTemplate } from "@prisma/client";
import { OPENAIFastAPIKBParamType, OPENAIFastAPIParamType, OPENAIFastAPISearchParamType } from "../types";
import axios from "axios";

const getRobotAnswerBase = async(
    robot: Robot & {robotTemp: RobotTemplate, mask: RobotMask | null} | null | undefined,
    message: string,
    history: {role:string, content:string}[] = [],
) => {

    let reply: any ={};

    //Insert mask infor into message history
    history.splice(0, 0, {
        role: 'system',
        content: robot?.mask?.content || ''
    });

    if (robot?.robotTemp.knowledgeAbility) {
        const AIParam: OPENAIFastAPIKBParamType = {
            query: message,
            knowledge_base_name: robot.knowledgeBaseName || "",
            model_name: "chatglm2-6b",
            history: history,
            temperature: robot.temperature || 0.7,
            top_k: robot.topK || 3,
            stream: false,
            local_doc_url: false,
            score_threshold: 1,
        }

        console.log('Knowledge AI Param', AIParam);

        await axios.post(robot.robotTemp.apiUrl, AIParam).then((callback) => {
            if (callback.status === 200)
                reply = callback.data;
        }).catch((err) => {
            console.error('err', err);
        });

    }else if (robot?.robotTemp.searchAbility){
        const AIParam: OPENAIFastAPISearchParamType = {
            query: message,
            search_engine_name: robot.searchEngineName || "",
            model_name: "chatglm2-6b",
            history: history,
            temperature: robot.temperature || 0.7,
            top_k: robot.topK || 3,
            stream: false,
        }

        console.log('Search AI Param', AIParam);

        await axios.post(robot.robotTemp.apiUrl, AIParam).then((callback) => {
            if (callback.status === 200)
                reply = callback.data;
        }).catch((err) => {
            console.error('err', err);
        });
    }else {
        if (history.length > 0){
            if (history.slice(-1)[0].content !== message)
                history.push({
                    role: 'user',
                    content: message
                });
            }
        else
            history.push({
                role: 'user',
                content: message
            });

        console.log('<==fastchat messages history==>\n', history);

        const AIParam: OPENAIFastAPIParamType = {
            model: "chatglm2-6b",
            messages: history,
            temperature: robot?.temperature || 0.7,
            n: robot?.historyRound || 1,
            max_tokens: 1024*2,
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
}

export default getRobotAnswerBase;