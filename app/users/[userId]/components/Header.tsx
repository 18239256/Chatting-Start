'use client';

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo, useState } from "react";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";

import useOtherUser from "@/app/hooks/useOtherUser";
import useActiveList from "@/app/hooks/useActiveList";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { FullUserType } from '@/app/types';


interface HeaderProps {
  user: FullUserType
}

const Header: React.FC<HeaderProps> = ({ user }) => {

  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  const statusText = useMemo(() => {
    return isActive ? '在线' : '离线'
  }, [isActive]);

  return (
  <>
    <div 
      className="
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      "
    >
      <div className="flex gap-3 items-center">
        <Link
          href="/users" 
          className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
          <Avatar user={user} />
        <div className="flex flex-col">
          <div>{user.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
 
export default Header;