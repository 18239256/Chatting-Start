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


interface HeaderProps {
  knowledge: Knowledge
}

const Header: React.FC<HeaderProps> = ({ knowledge }) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const delBTNClick = ()=>{

    if(!confirm(`请确认删除当前知识库：${knowledge.displayName} ?`)){
      return;
    };
    setIsLoading(true);

    axios.post('/api/knowledges/deleteknowledgebase', {
      knowledgeBaseName:knowledge.realName
    })
    .then((ret) => {
      router.push('/knowledge');
      router.refresh();
      console.log('ret', ret);
    })
    .catch(() => toast.error('Something went wrong!'))
    .finally(() => setIsLoading(false));
  }

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
          <TbDatabase size={36} className="lg:hidden"/>
          <div className="flex flex-col">
            <div>{knowledge.displayName}</div>
            <div className="text-sm font-light text-neutral-500">
              {knowledge.description}
            </div>
          </div>
        </div>
        <Tooltip  content="删除知识库" className='bg-red-500  text-gray-200'>
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
            <TbDatabaseX
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