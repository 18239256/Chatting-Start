'use client'

import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { Fragment, useMemo, useState } from 'react';
import { IoClose, IoTrash, IoBuild, IoSave, IoRefreshCircle } from 'react-icons/io5';

import ConfirmModal from './ConfirmModal';
import { Knowledge } from '@prisma/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Tooltip } from '@nextui-org/react';

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: Knowledge;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
    isOpen,
    onClose,
    data,
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [name, setName] = useState(data.displayName);
    const [description, setDescription] = useState(data.description);

    const createDate = useMemo(() => {
        return format(new Date(data.createdAt), 'yyyy年MM月dd');
    }, [data]);

    const closeMyself = () => {
        if (name !== data.displayName || description !== data.description) {
            axios.post('/api/knowledges/updateknowledgebase', {
                KnowledgeId: data.id,
                displayName: name,
                description: description,
            })
                .then()
                .catch((err) => toast.error('保存修改时出错了!', err))
                .finally();
        }
        onClose();
        setIsEdit(false);
    };

    const reset = () => {
        setName(data.displayName);
        setDescription(data.description);
        setIsEdit(false);
    };

    return (
        <>
            <ConfirmModal
                knowledge={data}
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
                                                        <div onClick={() => setConfirmOpen(true)} className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                                                            <Tooltip  content="删除" className='bg-red-500  text-gray-200'>
                                                            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-gray-50">
                                                                <IoTrash size={20} />
                                                            </div>
                                                            </Tooltip>
                                                        </div>}
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
                                                                    名称
                                                                </dt>
                                                                <dd
                                                                    className="
                                                                    mt-1 
                                                                    text-sm 
                                                                    text-gray-900 
                                                                    sm:col-span-2
                                                                    "
                                                                >
                                                                    {!isEdit && name}
                                                                    {isEdit && <input id={name} type='text' placeholder='请输入知识库名称' value={name} onChange={(e) => setName(e.target.value)} className='form-input
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
            sm:leading-6'></input>}
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
                                                                    {isEdit && <textarea value={description!} placeholder='请输入知识库描述' onChange={(e) => setDescription(e.target.value)} className='form-input
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
                                                                    <time dateTime={createDate}>
                                                                        {createDate}
                                                                    </time>
                                                                </dd>
                                                            </div>
                                                            <hr />
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