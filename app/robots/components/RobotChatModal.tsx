'use client';

import axios from 'axios';
import React, { useState } from 'react'
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
import { RadioGroup } from '@headlessui/react';


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

    // Create new robot user base on current logo in user
    axios.post('/api/robot/robotregister', {...data,robotTmpl:tmpl})
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
                                        src={'/images/knowledge.png'}
                                        alt="Avatar"
                                      />
                                    </div> : null}
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