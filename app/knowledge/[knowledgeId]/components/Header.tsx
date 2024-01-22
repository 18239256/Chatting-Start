'use client';

import { HiChevronLeft } from 'react-icons/hi'
import { TbDatabase, TbDatabaseX} from 'react-icons/tb';
import Link from "next/link";
import { Knowledge } from "@prisma/client";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Tooltip } from '@nextui-org/react';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';


interface HeaderProps {
  knowledge: Knowledge
}

const Header: React.FC<HeaderProps> = ({ knowledge }) => {

  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ProfileDrawer
        data={knowledge}
        isOpen={drawerOpen}
        onClose={() => {setDrawerOpen(false);router.refresh();}}
      />
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
            href="/knowledge"
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
          <TbDatabase size={36} className="lg:hidden"/>
          <div className="flex flex-col">
            <div>{knowledge.displayName}</div>
            <div className="text-sm font-light text-neutral-500">
              {knowledge.description}
            </div>
          </div>
        </div>        
        <div className='flex gap-2'>
         <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="
        text-sky-500
        cursor-pointer
        hover:text-sky-600
        transition
      "
        /></div>
      </div>
    </>
  );
}

export default Header;