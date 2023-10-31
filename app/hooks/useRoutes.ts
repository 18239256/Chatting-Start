import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiBookOpen, HiUsers } from 'react-icons/hi2';
import {FaRobot} from 'react-icons/fa6'
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();
  const pathpattern = {
    conversations: /^\/conversations.*$/,
  }

  const routes = useMemo(() => [
    { 
      label: 'Chat', 
      href: '/conversations', 
      icon: HiChat,
      active: /^\/conversations.*$/.test(pathname || "")
    },
    { 
      label: 'Users', 
      href: '/users', 
      icon: HiUsers, 
      active: /^\/users.*$/.test(pathname || "")
    },
    { 
      label: 'Robots', 
      href: '/robots', 
      icon: FaRobot, 
      active: /^\/robots.*$/.test(pathname || "")
    },
    { 
      label: 'Knowledge', 
      href: '/knowledge', 
      icon: HiBookOpen, 
      active: /^\/knowledge.*$/.test(pathname || "")
    },
    {
      label: 'Logout', 
      onClick: () => signOut(),
      href: '#',
      icon: HiArrowLeftOnRectangle, 
    }
  ], [pathname, conversationId]);

  return routes;
};

export default useRoutes;