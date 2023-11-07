'use client'

import Avatar from '@/app/components/Avatar';
import useRobotOtherUser from '@/app/hooks/useRobotOtherUser';
import { Dialog, Transition } from '@headlessui/react';
import { Conversation, User } from '@prisma/client';
import { format } from 'date-fns';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { IoClose, IoTrash } from 'react-icons/io5';

import ConfirmModal from './ConfirmModal';
import AvatarGroup from '@/app/components/AvatarGroup';
import useActiveList from '@/app/hooks/useActiveList';

import {FullUserType } from "@/app/types";
import toast from 'react-hot-toast';
import axios from 'axios';

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
    const [confirmOpen, setConfirmOpen] = useState(false);
    const otherUser = useRobotOtherUser(data);
    const [temperature, setTemperature] = useState(otherUser.robot?.temperature || 0.8);
    const [history, setHistory] = useState(otherUser.robot?.historyRound || 5);
    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    useEffect(() => {
        axios.post('/api/robot/robotupdate', {robotId: otherUser.robot?.id, temperature: temperature, historyRound: history })
            .then()
            .catch((err) => toast.error('保存修改时出错了!', err))
            .finally();
    }, [history, temperature]);

    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP');
    }, [otherUser.createdAt]);

    const title = useMemo(() => {
        return data.name || otherUser.name;
    }, [data.name, otherUser.name]);

    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${data.users.length} members`;
        }

        return isActive ? '在线' : '离线'
    }, [data, isActive]);

    return (
        <>
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            />
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                                                            onClick={onClose}
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
                                                        {data.isGroup ? (
                                                            <AvatarGroup users={data.users} />
                                                        ) :
                                                            (
                                                                <Avatar user={otherUser} />
                                                            )
                                                        }
                                                    </div>
                                                    <div>
                                                        {title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {statusText}
                                                    </div>
                                                    <div className="flex gap-10 my-8">
                                                        <div onClick={() => setConfirmOpen(true)} className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                                                            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                                                <IoTrash size={20} />
                                                            </div>
                                                            <div className="text-sm font-light text-neutral-600">
                                                                删除
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                                                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                            {data.isGroup && (
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
                                                                        Emails
                                                                    </dt>
                                                                    <dd
                                                                        className="
                                                                    mt-1 
                                                                    text-sm 
                                                                    text-gray-900 
                                                                    sm:col-span-2
                                                                    "
                                                                    >
                                                                        {data.users.map((user) => user.email).join(', ')}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            {!data.isGroup && (
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
                                                            )}
                                                            {!data.isGroup && (
                                                                <>
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
                                                                </>
                                                            )}
                                                            <hr />
                                                            <form>
                                                                <div className="space-y-12">
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