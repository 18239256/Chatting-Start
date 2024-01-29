'use client'

import Avatar from '@/app/components/Avatar';
import useRobotOtherUser from '@/app/hooks/useRobotOtherUser';
import { Dialog, Transition } from '@headlessui/react';
import { Conversation, User } from '@prisma/client';
import { format } from 'date-fns';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { IoClose, IoTrash, IoBuild, IoSave, IoRefreshCircle, IoCopyOutline } from 'react-icons/io5';

import ConfirmModal from './ConfirmModal';
import useActiveList from '@/app/hooks/useActiveList';

import { FullUserType } from "@/app/types";
import toast from 'react-hot-toast';
import axios from 'axios';
import AvatarWithKB from '@/app/components/AvatarWithKB';
import { Switch, Tooltip } from '@nextui-org/react';

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: Conversation & {
        users: FullUserType[]
    }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
    isOpen,
    onClose,
    data,
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const otherUser = useRobotOtherUser(data);
    const [name, setName] = useState(otherUser.robot?.name);
    const [description, setDescription] = useState(otherUser.robot?.description);
    const [temperature, setTemperature] = useState(otherUser.robot?.temperature || 0.8);
    const [history, setHistory] = useState(otherUser.robot?.historyRound || 5);
    const [topK, setTopK] = useState(otherUser.robot?.topK || 3);
    const [isShared, setIsShared] = useState(otherUser.robot?.isShared!);
    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP');
    }, [otherUser.createdAt]);

    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${data.users.length} members`;
        }

        return isActive ? '在线' : '离线'
    }, [data, isActive]);

    const closeMyself = () => {
        axios.post('/api/robot/robotupdate', {
            robotId: otherUser.robot?.id,
            name: name,
            description: description,
            temperature: temperature,
            historyRound: history,
            topK: topK,
            isShared: isShared,
        })
            .then()
            .catch((err) => toast.error('保存修改时出错了!', err))
            .finally();
        onClose();
        setIsEdit(false);
    };

    const reset = () => {
        setName(otherUser.robot?.name);
        setDescription(otherUser.robot?.description);
        setIsEdit(false);
    };
    
    const copyHandle = (content:string) => {
        let copy = (e:any)=>{
            e.preventDefault()
            e.clipboardData.setData('text/plain',content);
            toast.success('复制成功');
            document.removeEventListener('copy',copy);
        }
        document.addEventListener('copy',copy);
        document.execCommand("Copy");
      }

    return (
        <>
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            />
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeMyself}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-end">
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                            onClick={closeMyself}
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <IoClose size={24} aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-2">
                                                        {Boolean(otherUser.robot?.knowledgeBaseName) ? (
                                                            <AvatarWithKB user={otherUser} />
                                                        ) : (
                                                            <Avatar user={otherUser} />
                                                        )}
                                                    </div>
                                                    {!isEdit &&
                                                        <div>
                                                            {name}
                                                        </div>}
                                                    {isEdit && <div> <input id={name} type='text' placeholder='请输入机器人名称' value={name} onChange={(e) => setName(e.target.value)} className='form-input
            block 
            w-full 
            rounded-md 
            border-0 
            text-center
            py-1.5
            px-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6'></input></div>}
            <div className="flex gap-1 my-8 ">
                <div className='text-gray-400 flex items-center justify-center'>{otherUser.robot?.id}</div>
                <div onClick={() => copyHandle(otherUser.robot?.id!)} className='text-gray-400 flex items-center cursor-pointer  justify-center'><IoCopyOutline size={20} /></div>
            </div>
            
                                                    <div className="flex gap-10 my-8 ">
                                                        {!isEdit && 
                                                        <Tooltip  content="编辑" className='bg-sky-500  text-gray-200'>
                                                        <div onClick={() => setIsEdit(true)} className="w-10 h-10 bg-neutral-100 rounded-full flex items-center cursor-pointer  justify-center hover:bg-sky-500 hover:text-gray-50">
                                                            <IoBuild size={20} />
                                                        </div>
                                                        </Tooltip>}
                                                        {isEdit && (<>
                                                            <Tooltip  content="重置" className='bg-sky-500  text-gray-200'>
                                                            <div onClick={reset} className="w-10 h-10 bg-neutral-100 rounded-full flex items-center cursor-pointer  justify-center hover:bg-sky-500 hover:text-gray-50">
                                                                <IoRefreshCircle size={20} />
                                                            </div>
                                                            </Tooltip>
                                                            <Tooltip  content="保存" className='bg-sky-500  text-gray-200'>
                                                            <div onClick={() => setIsEdit(false)} className="w-10 h-10 bg-neutral-100 rounded-full flex items-center cursor-pointer  justify-center hover:bg-sky-500 hover:text-gray-50">
                                                                <IoSave size={20} />
                                                            </div>
                                                            </Tooltip>
                                                        </>)}
                                                        {!isEdit &&
                                                            <Tooltip  content="删除" className='bg-red-500  text-gray-200'>
                                                            <div onClick={() => setConfirmOpen(true)} className="w-10 h-10 bg-neutral-100 rounded-full flex items-center cursor-pointer justify-center hover:bg-red-500 hover:text-gray-50">
                                                                <IoTrash size={20} />
                                                            </div>
                                                            </Tooltip>
                                                        }
                                                    </div>
                                                    <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                                                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                            <div>
                                                                <dt
                                                                    className="
                                                                    text-sm 
                                                                    font-medium 
                                                                    text-gray-500 
                                                                    sm:w-40 
                                                                    sm:flex-shrink-0
                                                                    "
                                                                >
                                                                    描述
                                                                </dt>
                                                                <dd
                                                                    className="
                                                                    mt-1 
                                                                    text-sm 
                                                                    text-gray-900 
                                                                    sm:col-span-2
                                                                    "
                                                                >
                                                                    {!isEdit && description}
                                                                    {isEdit && <textarea value={description!} placeholder='请输入机器人描述' onChange={(e) => setDescription(e.target.value)} className='form-input
            block 
            w-full 
            rounded-md 
            border-0 
            py-1.5
            px-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6'></textarea>}
                                                                </dd>
                                                            </div>

                                                            <div>
                                                                <dt
                                                                    className="
                                                                    text-sm 
                                                                    font-medium 
                                                                    text-gray-500 
                                                                    sm:w-40 
                                                                    sm:flex-shrink-0
                                                                    "
                                                                >
                                                                    Email
                                                                </dt>
                                                                <dd
                                                                    className="
                                                                    mt-1 
                                                                    text-sm 
                                                                    text-gray-900 
                                                                    sm:col-span-2
                                                                    "
                                                                >
                                                                    {otherUser.email}
                                                                </dd>
                                                            </div>
                                                            <div>
                                                                <dt
                                                                    className="
                                                                        text-sm 
                                                                        font-medium 
                                                                        text-gray-500 
                                                                        sm:w-40 
                                                                        sm:flex-shrink-0
                                                                    "
                                                                >
                                                                    创建时间
                                                                </dt>
                                                                <dd
                                                                    className="
                                                                        mt-1 
                                                                        text-sm 
                                                                        text-gray-900 
                                                                        sm:col-span-2
                                                                    "
                                                                >
                                                                    <time dateTime={joinedDate}>
                                                                        {joinedDate}
                                                                    </time>
                                                                </dd>
                                                            </div>
                                                            <hr />
                                                            <form>
                                                                <div className="space-y-12">
                                                                    <div className="col-span-full">
                                                                        <Switch
                                                                            isSelected={isShared!}
                                                                            onValueChange={setIsShared}
                                                                        >
                                                                            {isShared ? "已共享" : "未共享"}
                                                                        </Switch>
                                                                    </div>
                                                                    <div className="col-span-full">
                                                                        <label htmlFor="temprange" className="block text-sm font-medium leading-6 text-gray-500">
                                                                            幻想度 <b className="text-sky-600">{temperature}</b>
                                                                        </label>
                                                                        <input id="default-range" type="range" min="0" max="1" step="0.1" defaultValue={temperature} onChange={value => setTemperature(Number(value.target.value) || 0)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                                                    </div>
                                                                    <div className="col-span-full">
                                                                        <label htmlFor="history" className="block text-sm font-medium leading-6 text-gray-500">
                                                                            历史对话轮数
                                                                        </label>
                                                                        <input type="number" id="history" min={1} max={10} defaultValue={history} onChange={value => setHistory(Number(value.target.value) || 0)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required></input>
                                                                    </div>
                                                                    {Boolean(otherUser.robot?.knowledgeBaseName) &&
                                                                        <div className="col-span-full">
                                                                            <label htmlFor="topKrange" className="block text-sm font-medium leading-6 text-gray-500">
                                                                                匹配条数 <b className="text-sky-600">{topK}</b>
                                                                            </label>
                                                                            <input id="default-range" type="range" min="1" max="6" step="1" defaultValue={topK} onChange={value => setTopK(Number(value.target.value) || 0)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                                                        </div>}
                                                                </div>
                                                            </form>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default ProfileDrawer;