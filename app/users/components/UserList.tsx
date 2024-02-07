'use client';


import { User } from "@prisma/client";

import UserBox from "./UserBox";
import useUser from "@/app/hooks/useUser";
import clsx from "clsx";

interface UserListProps {
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ 
  items, 
}) => {
  const { userId, isOpen } = useUser();
  return ( 
    <aside 
      className={clsx(`
      fixed 
      inset-y-0 
      pb-20
      lg:pb-0
      lg:left-20 
      lg:w-80 
      lg:block
      overflow-y-auto 
      border-r 
      border-gray-200 
    `, isOpen ? 'hidden' : 'block w-full left-0')}
    >
      <div className="px-5">
        <div className="flex-col">
          <div 
            className="
              text-2xl 
              font-bold 
              text-neutral-800 
              py-4
            "
          >
            用户
          </div>
        </div>
        {items.map((item) => (
          <UserBox
            key={item.id}
            data={item}
            selected={userId === item.id}
          />
        ))}
      </div>
    </aside>
  );
}
 
export default UserList;