import getCurrentUser from "../getCurrentUser";
import axios from "axios";
import { format } from "url";

const getKnowledgeFileList = async (
    knowledgeId: string
) => {
    try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser?.id) {
            return "";
        }
        

        if (knowledgeId) {
            const param = {
                knowledge_base_name: knowledgeId
            };
            const apiUrl = format({
                protocol: process.env.LLM_API_PROTOCOL,
                hostname: process.env.LLM_API_HOST,
                port: process.env.LLM_API_PORT,
                pathname: "/api/knowledge_base/list_files",
                query:{
                    knowledge_base_name: knowledgeId,
                    format: 'json'
                }
            });

            axios.get(apiUrl).then((callback) => {
                if (callback.status === 200 && callback.data.code === 200)
                    console.log('LLM says: ', callback.data.data);
                return callback.data;
            })
        }

    } catch (error: any) {
        return "";
    }
};

export default getKnowledgeFileList;