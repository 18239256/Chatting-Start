import { Robot, RobotMask, RobotTemplate } from "@prisma/client";
import { OPENAIFastAPIKBParamType, OPENAIFastAPIParamType, OPENAIFastAPISearchParamType, RobotReplyType } from "../types";
import axios from "axios";
import { isEmpty } from "lodash";
import getKnowledgesByName from "./getKnowledgesByName";



const getRobotAnswerBase = async(
    robot: Robot & {robotTemp: RobotTemplate, mask: RobotMask | null} | null | undefined,
    message: string,
    history: {role:string, content:string}[],
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
            apiUrl = process.env.NEXT_PUBLIC_LLM_API_URI + robot.robotTemp.apiUrl +`/graph_kb/${robot.knowledgeBaseName}/chat/completions`;
        else
            apiUrl = process.env.NEXT_PUBLIC_LLM_API_URI + robot.robotTemp.apiUrl +`/local_kb/${robot.knowledgeBaseName}/chat/completions`;

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
        let tmpTxt:string;
        const response = await axios.post(apiUrl, AIParams,{responseType:"stream"});
        response.data.on('data', (chunk:any) => {
            const chunkTxt : string = chunk.toString('utf8');
            if(chunkTxt.toLowerCase().startsWith("data:")){
                console.log('response chunkTxt:====> \n\n', chunkTxt);
                console.log('<====response chunkTxt end');
                if (!isEmpty(tmpTxt)) {
                    const jsonTmp =  JSON.parse(tmpTxt);
                    if("docs" in jsonTmp)
                        reply.docs = jsonTmp.docs;
                    else
                        reply.answer += jsonTmp.choices![0].delta.content;
                }
                tmpTxt = chunkTxt.slice(6);
            }
            else
                if(!chunkTxt.toLowerCase().startsWith(": ping"))
                    tmpTxt += chunkTxt;
        });
        response.data.on('end', () => {
            console.log('AI replies: ', reply);
            resolve(reply);

        });
        response.data.on('error', (error:any) => {
            reject(error);
        });
    });
}

export default getRobotAnswerBase;