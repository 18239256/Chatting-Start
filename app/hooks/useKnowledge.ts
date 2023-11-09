import { useParams } from "next/navigation";
import { useMemo } from "react";

const useKnowledge = () => {
  const params = useParams();

  const knowledgeId = useMemo(() => {
    if (!params?.knowledgeId) {
      return '';
    }

    return params.knowledgeId as string;
  }, [params?.knowledgeId]);

  const isOpen = useMemo(() => !!knowledgeId, [knowledgeId]);

  return useMemo(() => ({
    isOpen,
    knowledgeId: knowledgeId
  }), [isOpen, knowledgeId]);
};

export default useKnowledge;