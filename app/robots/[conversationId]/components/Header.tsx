'use client';

import { HiChevronLeft } from 'react-icons/hi'
import { HiChevronDown, HiEllipsisHorizontal } from 'react-icons/hi2';
import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { Conversation, Knowledge, RobotMask, User } from "@prisma/client";


import Avatar from "@/app/components/Avatar";
import ProfileDrawer from './ProfileDrawer';
import { FullUserType } from '@/app/types';
import { BiMask } from 'react-icons/bi';
import { Menu, Transition } from '@headlessui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AvatarWithKB from '@/app/components/AvatarWithKB';
import useRobotOtherUser from '@/app/hooks/useRobotOtherUser';
import useActiveList from "@/app/hooks/useActiveList";
import useCurrentUser from '@/app/hooks/useCurrentUser';
import { Button } from '@nextui-org/react';

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

interface HeaderProps {
  conversation: Conversation & {
    users: FullUserType[]
  }
  masks: RobotMask[]
}

const Header: React.FC<HeaderProps> = ({ conversation, masks}) => {

  const router = useRouter();
  const robotUser = useRobotOtherUser(conversation);
  const curUser = useCurrentUser(conversation);
  const [mask, setMask] = useState(masks.find((m) => m.id === robotUser.robot?.maskId)?.title || "");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(robotUser?.email!) !== -1;
  
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} 个成员`;
    }

    return isActive ? '在线' : '离线'
  }, [conversation, isActive]);

  const onMaskItemClick = (maskItem?: RobotMask) => {
    axios.post('/api/robot/robotupdate', {robotId:robotUser.robot?.id,maskId:maskItem?.id || null})
        .then(() => {setMask(maskItem?.title || '');
          router.refresh();
          })
        .catch((err) => toast.error('出错了!',err))
        .finally();
    return;
  };

  const disconnectShareRobot = () =>{
    axios.post('/api/robot/robotconsumecut', { robotId: robotUser.robot?.id })
      .then(()=>{router.push('/robots');})
      .catch(() => toast.error('出错了!'))
      .finally(() => {  });
  };

  return (
    <>
      <ProfileDrawer
        data={conversation}
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
            href="/robots"
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
          {Boolean(robotUser.robot?.knowledgeBaseName) ? (
            <AvatarWithKB user={robotUser} />
          ) : (
            <Avatar user={robotUser} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || robotUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <div className="flex flex-col px-6">
              <Menu.Button className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1 lg:text-sm sm:text-xs  font-semibold text-sky-500 cursor-pointer" >
                <BiMask size={26} />
                {mask}
                <HiChevronDown className="-mr-1 h-5 w-5 text-sky-500" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                {masks.map((mask) => (
                  <Menu.Item key={mask.id}>
                    {({ active }) => (
                      <button
                        onClick={()=>onMaskItemClick(mask)}
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-md text-justify'
                        )}
                      >
                        <div className='inline-flex items-center gap-1 rounded-md bg-blue-50 py-1 text-sm font-semibold text-sky-500'>
                          <BiMask size={26} />
                          {mask.title}</div>
                        <div className='text-gray-400'>{mask.content}</div>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
              <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={()=>onMaskItemClick()}
                    className={`${
                      active ? ' bg-sky-600 text-gray-100 justify-center' : 'inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-sky-500 cursor-pointer justify-center'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    清  除
                  </button>
                )}
              </Menu.Item>
              </div>
              </Menu.Items>
            </Transition>
          </Menu>
                 
        </div>
        {curUser?.id === robotUser.robotOwnerId ? (
          <HiEllipsisHorizontal
            size={32}
            onClick={() => setDrawerOpen(true)}
            className="
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        "
          />) : (
          <Button
            className={"bg-transparent text-foreground border-default-200"}
            color="primary"
            radius="full"
            size="sm"
            variant={"bordered"}
            onPress={() => disconnectShareRobot()}
          >
            {true ? "停用" : "启用"}
          </Button>)}
      </div>
    </>
  );
}

export default Header;