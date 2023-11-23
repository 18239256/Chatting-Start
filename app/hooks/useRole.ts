import { useParams } from "next/navigation";
import { useMemo } from "react";

const useRole = () => {
  const params = useParams();

  const roleId = useMemo(() => {
    if (!params?.roleId) {
      return '';
    }

    return params.roleId as string;
  }, [params?.roleId]);

  const isOpen = useMemo(() => !!roleId, [roleId]);

  return useMemo(() => ({
    isOpen,
    roleId: roleId
  }), [isOpen, roleId]);
};

export default useRole;