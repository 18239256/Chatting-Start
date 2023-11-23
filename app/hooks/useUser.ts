import { useParams } from "next/navigation";
import { useMemo } from "react";

const useUser = () => {
  const params = useParams();

  const userId = useMemo(() => {
    if (!params?.userId) {
      return '';
    }

    return params.userId as string;
  }, [params?.userId]);

  const isOpen = useMemo(() => !!userId, [userId]);

  return useMemo(() => ({
    isOpen,
    userId: userId
  }), [isOpen, userId]);
};

export default useUser;