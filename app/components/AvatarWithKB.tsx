'use client';

import { User } from "@prisma/client";
import Image from "next/image";
import { FullUserType } from "../types";
import { TbDatabase } from "react-icons/tb";

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
        key={user?.id}
        className={`
            absolute
            inline-block 
            rounded-full 
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[2]}
          `}>
        <TbDatabase className="h-5 w-5" />
      </div>
    </div>
  );
}

export default AvatarGroup;