'use client';

import axios from 'axios';
import React, { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation';
import {
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Knowledge, RobotTemplate } from "@prisma/client";

import { toast } from 'react-hot-toast';
import Modal from '@/app/components/modals/Modal';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import Image from "next/image";
import { Menu, RadioGroup, Transition } from '@headlessui/react';
import { HiChevronDown } from 'react-icons/hi2';
import { TbDatabase } from 'react-icons/tb';

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

interface RobotChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  robotTmpls: RobotTemplate[];
  knowledges: Knowledge[];
}

function CheckIcon(props:any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function compareRobotTmpl(a:RobotTemplate, b:RobotTemplate) {
  return a.id === b.id;
}

const RobotChatModal: React.FC<RobotChatModalProps> = ({
  isOpen,
  onClose,
  robotTmpls = [],
  knowledges =[]
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tmpl, setTmpl] = useState(robotTmpls[0]);
  const [know, setKnow] = useState(()=>{return knowledges.length>0 && knowledges[0].displayName});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name:'',
    }
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    let param = {};
    if(tmpl.knowledgeAbility)
    {
      const selectKnow = knowledges.find((k)=>{return k.displayName === know});
      param = {...data,robotTmpl:tmpl, knowledgeBaseName: selectKnow?.realName};
    }
    else
      param = {...data,robotTmpl:tmpl};
    // Create new robot user base on current logo in user
    axios.post('/api/robot/robotregister', param)
      .then((callback) => {
        console.log(callback);
        if (callback?.status !== 200) {
          toast.error('注册信息错误');
        }

        if (callback?.status === 200) {
          toast.success('创建成功');

          // Create new 1 by 1 conversation by new robot user
          axios.post('/api/conversations', { userId: callback?.data.userId })
            .then(() => {
              router.push('/robots')
              router.refresh();
              onClose();
            })
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => setIsLoading(false));
        }
      })
      .catch(() => toast.error('出错了!'))
      .finally(() => setIsLoading(false));
  }

  const onKnowItemClick = (knowItem?: Knowledge) => {
    setKnow(knowItem?.displayName || '');
    console.log('knowItem', knowItem);
    return;
  };

  const knowContent = React.useMemo(() => {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex flex-col px-6">
          <Menu.Button className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1 lg:text-sm sm:text-xs  font-semibold text-sky-500 cursor-pointer" >
            <TbDatabase size={26} />
            {know}
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
          <Menu.Items className="absolute left-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {knowledges.map((k) => (
                <Menu.Item key={k.id}>
                  {({ active }) => (
                    <button
                      onClick={() => onKnowItemClick(k)}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-md text-justify'
                      )}
                    >
                      <div className='inline-flex items-center gap-1 rounded-md bg-blue-50 py-1 text-sm font-semibold text-sky-500'>
                        <TbDatabase size={26} />
                        {k.displayName}</div>
                      <div className='text-gray-400'>{k.description}</div>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>           
          </Menu.Items>
        </Transition>
      </Menu>
    );
  },[know]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
            >
              创建一个机器人
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              根据模板创建一个机器人。
            </p>
            
          {knowContent}
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="名称"
                id="name"
                errors={errors}
                required
                register={register}
              />

              <label
                className="
                block 
                text-sm 
                font-medium 
                leading-6 
                text-gray-900
              "              >
                选择模型
              </label>

              <div className="mx-auto w-full max-w-md">
                <RadioGroup value={tmpl} onChange={setTmpl} by={compareRobotTmpl}>
                  <RadioGroup.Label className="sr-only">选择模型</RadioGroup.Label>
                  <div className="space-y-2">
                    {robotTmpls.map((tmpl) => (
                      <RadioGroup.Option
                        key={tmpl.id}
                        value={tmpl}
                        className={({ active, checked }) =>
                          `${active
                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                            : ''
                          }
                  ${checked ? 'bg-sky-600/75 text-white' : 'bg-white'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${checked ? 'text-white' : 'text-gray-800'
                                      }`}
                                  >
                                    {tmpl.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${checked ? 'text-sky-100' : 'text-gray-400'
                                      }`}
                                  >
                                    <div>
                                    <span>{tmpl.description}</span>
                                    </div>
                                    {tmpl.knowledgeAbility ? 
                                    <div className='justify-end'>
                                                                          
                                    </div>: null}
                                    {tmpl.searchAbility ? 
                                    <div className="
                                        relative 
                                        inline-block 
                                        rounded-full 
                                        overflow-hidden
                                        h-9 
                                        w-9 
                                        md:h-11 
                                        md:w-11
                                      ">
                                      <Image
                                        fill
                                        src={'/images/bing.png'}
                                        alt="Avatar"
                                      />
                                    </div> : null}
                                  </RadioGroup.Description>
                                </div>
                              </div>                              
                              {checked && (
                                <div className="shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            secondary
          >
            取消
          </Button>
          <Button disabled={isLoading} type="submit">
            创建
          </Button>
        </div>
      </form>
    </Modal>
  )

}

export default RobotChatModal;