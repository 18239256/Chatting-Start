'use client';


import { Role } from "@prisma/client";

import RoleBox from "./RoleBox";
import useRole from "@/app/hooks/useRole";
import clsx from "clsx";

interface RoleListProps {
  items: Role[];
}

const RoleList: React.FC<RoleListProps> = ({ 
  items, 
}) => {
  const { roleId, isOpen } = useRole();
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
            联系人
          </div>
        </div>
        {items.map((item) => (
          <RoleBox
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </aside>
  );
}
 
export default RoleList;