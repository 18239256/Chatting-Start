'use client';


import { Role } from "@prisma/client";

import RoleBox from "./RoleBox";
import useRole from "@/app/hooks/useRole";
import clsx from "clsx";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { FaRegAddressCard } from "react-icons/fa6";
import RoleModal from "./RoleModal";

interface RoleListProps {
  items: Role[];
}

const RoleList: React.FC<RoleListProps> = ({
  items,
}) => {
  const { roleId, isOpen } = useRole();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <><RoleModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
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
          <div className="flex justify-between mb-4 pt-4">
            <div
              className="
              text-2xl 
              font-bold 
              text-neutral-800 
            "
            >
              角色管理
            </div>
            <Tooltip content="添加角色" className='bg-sky-600  text-gray-50'>
              <div
                onClick={() => setIsModalOpen(true)}
                className="
                rounded-full 
                p-2 
                bg-sky-500 
                hover:bg-sky-600 
                text-white
                cursor-pointer 
                hover:opacity-75 
                transition
              "
              >
                <FaRegAddressCard size={20} />

              </div></Tooltip>
          </div>
          {items.map((item) => (
            <RoleBox
              key={item.id}
              data={item}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default RoleList;