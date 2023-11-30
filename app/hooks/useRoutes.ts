import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiBookOpen, HiUsers } from 'react-icons/hi2';
import {FaIdBadge, FaRobot} from 'react-icons/fa6'
import { signOut } from "next-auth/react";
import { RiLogoutBoxFill } from "react-icons/ri";

const useRoutes = () => {
  const pathname = usePathname();

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
      label: 'Roles', 
      href: '/roles', 
      icon: FaIdBadge, 
      active: /^\/role.*$/.test(pathname || "")
    },
    {
      label: 'Logout', 
      onClick: () => signOut(),
      href: '#',
      icon: RiLogoutBoxFill, 
    }
  ], [pathname]);

  return routes.slice(1,6);
};

export default useRoutes;