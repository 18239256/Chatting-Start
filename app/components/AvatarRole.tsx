'use client';

import { Role } from "@prisma/client";
import clsx from "clsx";

import Image from "next/image";
import { FaIdBadge } from "react-icons/fa6";

interface AvatarProps {
  role?: Role;
};

const AvatarRole: React.FC<AvatarProps> = ({ role }) => {
  return (
    <div className="relative">
      <div
        className={clsx(`
                rounded-full 
                p-2 
                text-gray-100
                cursor-pointer 
                hover:opacity-75 
                transition
              `,role?.defaultRole?'bg-orange-600':'bg-gray-500')}
      >
        <FaIdBadge size={20} />
      </div>
    </div>
  );
}

export default AvatarRole;