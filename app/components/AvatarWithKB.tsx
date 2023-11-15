'use client';

import { User } from "@prisma/client";
import Image from "next/image";
import { FullUserType } from "../types";
import { TbDatabase } from "react-icons/tb";
import { FaDatabase } from "react-icons/fa";
import { Badge } from "@nextui-org/react";

interface AvatarGroupProps {
  user?: FullUserType;
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  user
}) => {

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  return (
    <div className="relative h-11 w-11">
      <div
        key={user?.id}
        className={`
          relative 
          inline-block 
          rounded-full 
          overflow-hidden
          h-9 
          w-9 
          md:h-11 
          md:w-11
          `}>
        <Image
          fill
          src={user?.image || '/images/placeholder.jpg'}
          alt="Avatar"
        />
      </div>
      <div
        key={1}
        className={`
            absolute
            inline-block 
            rounded-full 
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[2]}
          `}>
        <FaDatabase className="h-4 w-5 text-green-600 bg-gray-100" />
      </div>
    </div>
  );
}

export default AvatarGroup;