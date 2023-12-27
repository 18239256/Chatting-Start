import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { BiSolidMask } from 'react-icons/bi';
import { HiBookOpen, HiUsers } from 'react-icons/hi2';
import {FaIdBadge, FaRobot, FaStore} from 'react-icons/fa6'
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
      label: 'Robots', 
      href: '/robots', 
      icon: FaRobot, 
      active: /^\/robots.*$/.test(pathname || "")
    },
    { 
      label: 'RobotMarket', 
      href: '/robotmarket', 
      icon: FaStore, 
      active: /^\/robotmarket.*$/.test(pathname || "")
    },
    { 
      label: 'Knowledge', 
      href: '/knowledge', 
      icon: HiBookOpen, 
      active: /^\/knowledge.*$/.test(pathname || "")
    },
    { 
      label: 'Masks', 
      href: '/masks', 
      icon: BiSolidMask, 
      active: /^\/masks.*$/.test(pathname || "")
    },
    { 
      label: 'Users', 
      href: '/users', 
      icon: HiUsers, 
      active: /^\/users.*$/.test(pathname || "")
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

  return routes;
};

export default useRoutes;