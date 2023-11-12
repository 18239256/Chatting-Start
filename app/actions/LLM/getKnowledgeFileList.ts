import getCurrentUser from "../getCurrentUser";
import axios from "axios";
import { format } from "url";

const getKnowledgeFileList = async (
    knowledgeId: string
) => {
    try {
        let ret : string[] = [];
        const currentUser = await getCurrentUser();
        
        if (!currentUser?.id) {
            return ret;
        }

        if (knowledgeId) {
            const apiUrl = format({
                protocol: process.env.LLM_API_PROTOCOL,
                hostname: process.env.LLM_API_HOST,
                port: process.env.LLM_API_PORT,
                pathname: "/api/knowledge_base/list_files",
                query: {
                    knowledge_base_name: knowledgeId,
                    format: 'json'
                }
            });

            const result = await axios.get(apiUrl);
            if (result.status === 200 && result.data.code === 200)
                ret = result.data.data;
        }
        return ret;

    } catch (error: any) {
        return [];
    }
};

export default getKnowledgeFileList;