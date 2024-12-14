import getCurrentUser from "../getCurrentUser";
import axios from "axios";
import { format } from "url";

const updateDocs = async (
    knowledgeBaseName: string,
    file_names: string[]
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
                file_names: file_names,
            };
            const apiUrl = format({
                protocol: process.env.NEXT_PUBLIC_LLM_API_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_LLM_API_HOST,
                port: process.env.NEXT_PUBLIC_LLM_API_PORT,
                pathname: "/api/knowledge_base/update_docs"
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

export default updateDocs;