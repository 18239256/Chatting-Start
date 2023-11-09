'use client';

import { HiChevronLeft } from 'react-icons/hi'
import Link from "next/link";
import { Knowledge} from "@prisma/client";

interface HeaderProps {
  knowledge:Knowledge
}

const Header: React.FC<HeaderProps> = ({ knowledge }) => {

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
        <div className="flex flex-col">
          <div>{knowledge.displayName}</div>
          <div className="text-sm font-light text-neutral-500">
            {knowledge.realName}
          </div>
        </div>
      </div>
     
    </div>
    </>
  );
}
 
export default Header;