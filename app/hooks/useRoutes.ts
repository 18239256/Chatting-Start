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

  const routes = useMemo(() => [
    { 
      label: 'Chat', 
      href: '/conversations', 
      icon: HiChat,
      active: pathname === '/conversations' || !!conversationId
    },
    { 
      label: 'Users', 
      href: '/users', 
      icon: HiUsers, 
      active: pathname === '/users'
    },
    { 
      label: 'Robots', 
      href: '/robots', 
      icon: FaRobot, 
      active: pathname === '/robots'
    },
    { 
      label: 'Knowledge', 
      href: '/knowledge', 
      icon: HiBookOpen, 
      active: pathname === '/knowledge'
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