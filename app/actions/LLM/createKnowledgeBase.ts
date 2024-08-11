import getCurrentUser from "../getCurrentUser";
import axios from "axios";
import { format } from "url";

const delKnowledgeFiles = async (
    knowledgeBaseName: string,
) => {
    try {
        let ret = {};
        const currentUser = await getCurrentUser();
        
        if (!currentUser?.id) {
            return ret;
        }

        if (knowledgeBaseName) {
            const param = {
                knowledge_base_name: knowledgeBaseName,
                vector_store_type: process.env.NEXT_PUBLIC_VECTOR_STORE_TYPE,
                embed_model: process.env.NEXT_PUBLIC_EMBED_MODEL_NAME,
            };
            const apiUrl = format({
                protocol: process.env.NEXT_PUBLIC_LLM_API_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_LLM_API_HOST,
                port: process.env.NEXT_PUBLIC_LLM_API_PORT,
                pathname: "/api/knowledge_base/create_knowledge_base"
            });

            const result = await axios.post(apiUrl,param);
            if(result.status === 200 && result.data.code === 200)
                    ret = result.data;
        }
        return ret;

    } catch (error: any) {
        return [];
    }
};

export default delKnowledgeFiles;