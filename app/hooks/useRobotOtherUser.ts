import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullRobotConversationType, FullUserType } from "../types";

const useRobotOtherUser = (conversation: FullRobotConversationType | { users: FullUserType[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useRobotOtherUser;