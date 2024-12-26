import { Robot, RobotMask, RobotTemplate } from "@prisma/client";
import { OPENAIFastAPIKBParamType, OPENAIFastAPIParamType, OPENAIFastAPISearchParamType, RobotReplyType } from "../types";
import axios from "axios";
import OpenAI from 'openai';
import { isEmpty } from "lodash";
import getKnowledgesByName from "./getKnowledgesByName";



const getRobotAnswerBase = async(
    robot: Robot & {robotTemp: RobotTemplate, mask: RobotMask | null} | null | undefined,
    message: string,
    history: {role:string, content:string}[] = [],
) => {
    let reply: RobotReplyType ={answer:""};
    let apiUrl: string = process.env.NEXT_PUBLIC_LLM_API_URI+ robot!.robotTemp.apiUrl;
    let AIParams:OPENAIFastAPIParamType;

    //Insert mask infor into message history
    history.splice(0, 0, {
        role: 'system',
        content: robot?.mask?.content || ''
    });

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

    if (robot?.robotTemp.knowledgeAbility) {
        AIParams = {
            // query: message,
            // knowledge_base_name: robot.knowledgeBaseName || "",
            model: process.env.NEXT_PUBLIC_LLM_MODEL_NAME || "",
            messages: history,
            temperature: robot.temperature || 0.7,
            top_k: robot.topK || 3,
            stream: true,
            // local_doc_url: false,
            // score_threshold: 1,
        }

        const knowItem = await getKnowledgesByName(robot.knowledgeBaseName!);

        console.log('Knowledge AI Param', AIParams);
        if(knowItem?.vsType == "graph")
            apiUrl = process.env.NEXT_PUBLIC_LLM_API_URI + robot.robotTemp.apiUrl +`/graph_kb/${robot.knowledgeBaseName}`;
        else
            apiUrl = process.env.NEXT_PUBLIC_LLM_API_URI + robot.robotTemp.apiUrl +`/local_kb/${robot.knowledgeBaseName}`;

    }else if (robot?.robotTemp.searchAbility){
        AIParams = {
            // query: message,
            // search_engine_name: robot.searchEngineName || "",
            model: process.env.NEXT_PUBLIC_LLM_MODEL_NAME || "",
            messages: history,
            temperature: robot.temperature || 0.7,
            top_k: robot.topK || 3,
            // stream: true,
        }

        console.log('Search AI Param', AIParams);
    }else {
        AIParams = {
            model: process.env.NEXT_PUBLIC_LLM_MODEL_NAME || "",
            messages: history,
            temperature: robot?.temperature || 0.7,
            n: robot?.historyRound || 1,
            max_tokens: 1024*2,
            stop: [],
            stream: true,
            presence_penalty: 0,
            frequency_penalty: 0
        }

        console.log('LLM AI Param', AIParams);
        apiUrl = process.env.NEXT_PUBLIC_LLM_API_URI+ robot!.robotTemp.apiUrl;     
        
    }

    return new Promise(async (resolve, reject) =>{
        const openai = new OpenAI({
            baseURL:apiUrl,
            apiKey:process.env.NEXT_PUBLIC_LLM_API_KEY,
        })
        type extra_body = Record<'top_k', number>;
        const b: extra_body = {top_k: AIParams.top_k || 3};
        
        // Traditional call with OpenAI API
        // const stream = await openai.chat.completions.create({
        //     model: AIParams.model,
        //     messages: AIParams.messages,
        //     max_tokens: AIParams.max_tokens,
        //     stream: AIParams.stream || true, // stream
        //     temperature: AIParams.temperature,
        //     top_k: AIParams.top_k,
        // });

        const stream = await openai.chat.completions.create({...AIParams});
        // @ts-expect-error ignore the undocument parameters error in typescript verb.
        for await (const chunk of stream) {
            if("docs" in chunk){
                reply.docs = chunk.docs;
                continue;
            }
            reply.answer += chunk.choices[0].delta.content;
        }
        resolve(reply);
    });
}

export default getRobotAnswerBase;