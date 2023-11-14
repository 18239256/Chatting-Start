import getCurrentUser from "./getCurrentUser";
import getKnowledgesByUserId from "./getKnowledgesByUserId";

const getKnowledges = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const knowledges = await getKnowledgesByUserId(currentUser.id);

    return knowledges;
  } catch (error: any) {
    return [];
  }
};

export default getKnowledges;
