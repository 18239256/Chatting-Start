'use client';

import { HiChevronLeft } from 'react-icons/hi'
import { FaIdBadge, FaRegIdBadge } from "react-icons/fa";
import { LuBadgeX } from "react-icons/lu";
import Link from "next/link";
import { Role } from "@prisma/client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Tooltip } from '@nextui-org/react';
import LoadingModal from '@/app/components/modals/LoadingModal';


interface HeaderProps {
  role: Role
}

const Header: React.FC<HeaderProps> = ({ role}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const delBTNClick = ()=>{

    if(!confirm(`请确认删除当前角色：${role.name} ?`)){
      return;
    };
    // setIsLoading(true);

    // axios.post('/api/knowledges/deleteknowledgebase', {
    //   roleId:role.id
    // })
    // .then((ret) => {
    //   router.push('/roles');
    //   router.refresh();
    // })
    // .catch(() => toast.error('出错了!'))
    // .finally(() => setIsLoading(false));
  }

  return (
    <>
    {isLoading && (
        <LoadingModal />
      )}
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
            href="/roles"
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
          <FaRegIdBadge size={32} className="lg:hidden"/>
          <div className="flex flex-col">
            <div>{role.name}</div>
          </div>
        </div>
        <Tooltip  content="删除角色" className='bg-red-500  text-gray-200'>
          <button
            onClick={delBTNClick}
            className="
                        rounded-full 
                        p-2 
                        bg-gray-200 
                        cursor-pointer 
                        hover:bg-red-500
                        transition
                    "
          >
            <LuBadgeX
              size={18}
              className="text-white"
            />
          </button>
        </Tooltip>
      </div>
    </>
  );
}

export default Header;