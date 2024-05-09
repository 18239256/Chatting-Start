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
import { TbDatabase } from 'react-icons/tb';
import { Select, SelectItem, Selection, RadioGroup, Radio, cn } from '@nextui-org/react';
import Textarea from '@/app/components/inputs/Textarea';
import { FaDatabase, FaSearch } from 'react-icons/fa';
import { FaResearchgate } from 'react-icons/fa6';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface RobotChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  robotTmpls: RobotTemplate[];
  knowledges: Knowledge[];
  ownerUserId?: string;
}

function CheckIcon(props: any) {
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

function compareRobotTmpl(a: RobotTemplate, b: RobotTemplate) {
  return a.id === b.id;
}

const RobotChatModal: React.FC<RobotChatModalProps> = ({
  isOpen,
  onClose,
  robotTmpls = [],
  knowledges = [],
  ownerUserId,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tmpl, setTmpl] = useState(robotTmpls[0].id);
  const [know, setKnow] = useState<Selection>(new Set([]));

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
      name: '',
      description: '',
    }
  });

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  const getTmplObj = () => { return robotTmpls.find((t) => { return t.id === tmpl }) };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    let param = {};
    if (getTmplObj()?.knowledgeAbility) {
      const selectKnow = knowledges.find((k) => { return k.id === Array.from(know)[0] });
      param = { ...data, robotTmpl: getTmplObj(), knowledgeBaseName: selectKnow?.realName };
    } else if (getTmplObj()?.searchAbility) {
      param = { ...data, robotTmpl: getTmplObj(), searchEngineName: "bing" };
    } else
      param = { ...data, robotTmpl: getTmplObj() };

    if (ownerUserId)
      param = { ...param, ownerUserId: ownerUserId };

    console.log('param', param);

    // Create new robot user base on current logo in user
    axios.post('/api/robot/robotregister', param)
      .then((callback) => {
        if (callback?.status !== 200) {
          toast.error('注册信息错误');
        }

        if (callback?.status === 200) {
          toast.success('创建成功');
          const conParam = ownerUserId ? { userId: callback?.data.userId, puppetCurUserId: ownerUserId } : { userId: callback?.data.userId };
          // Create new 1 by 1 conversation by new robot user
          axios.post('/api/conversations', conParam)
          .then((callback) => {
            onClose();
            console.log('callback', callback);
            router.push(`/robots/${callback?.data.id}`);
          })
          .catch(() => toast.error('出错了!'))
          .finally(() => setIsLoading(false));
        }
      })
      .catch(() => toast.error('出错了!'))
      .finally(() => setIsLoading(false));
  }

  const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between w-full",
            "flex-row-reverse max-w-[500px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
            "data-[selected=true]:border-sky-600"
          ),
        }}
      >
        {children}
      </Radio>
    );
  };

  const knowContent = React.useMemo(() => {
    return (
      <Select
        items={knowledges}
        label="知识库"
        selectedKeys={know}
        className="max-w-xs"
        onSelectionChange={setKnow}
        variant="bordered"
        color="default"
        placeholder="请选择知识库"
        classNames={{
          label: "group-data-[filled=true]:-translate-y-5",
          trigger: "min-h-unit-16",
          listboxWrapper: "max-h-[400px]",
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        popoverProps={{
          classNames: {
            base: "before:bg-default-200",
            content: "p-0 border-small border-divider bg-background",
          },
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <TbDatabase size={26} />
              <div className="flex flex-col">
                <span>{item.data?.displayName}</span>
                <span className="text-default-500 text-tiny">({item.data?.description})</span>
              </div>
            </div>
          ));
        }}
      >
        {(k) => (
          <SelectItem key={k.id} textValue={k.displayName}>
            <div className="flex gap-2 items-center">
              <TbDatabase size={26} />
              <div className="flex flex-col">
                <span className="text-small">{k.displayName}</span>
                <span className="text-tiny text-default-400">{k.description}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    );
  }, [know]);

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
                placeholder='请输入机器人名称'
                required
                register={register}
              />
              <Textarea
                disabled={isLoading}
                label="描述"
                id="description"
                placeholder='请输入机器人描述说明'
                errors={errors}
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
              <div className="mx-auto w-full max-w-lg">
                <RadioGroup value={tmpl} onValueChange={setTmpl} color='default'>
                  {robotTmpls.map((t) => (
                    <div key={t.id}>
                      <CustomRadio description={t.description} value={t.id} key={t.id}>
                        <div className='flex flex-row gap-2 items-center'>
                          <div className="relative h-11 w-11">
                            <div className={`
                            relative 
                            inline-block 
                            rounded-full 
                            overflow-hidden
                            h-9 
                            w-9 
                            md:h-11 
                            md:w-11
                            `}><Image
                                fill
                                src='/images/robotbaby.jpg'
                                alt="Avatar"
                              />
                            </div>
                            {t.knowledgeAbility &&
                              <div
                                key={1}
                                className={`
                                absolute
                                inline-block 
                                rounded-full 
                                overflow-hidden
                                h-[21px]
                                w-[21px]
                                ${positionMap[2]}
                              `}>
                                <FaDatabase className="h-4 w-5 text-green-600 bg-gray-100" />
                              </div>}
                            {t.searchAbility &&
                              <div
                                key={1}
                                className={`
                                absolute
                                inline-block 
                                rounded-full 
                                overflow-hidden
                                h-[21px]
                                w-[21px]
                                ${positionMap[2]}
                              `}>
                                <FaSearch className="h-4 w-5 text-green-600 bg-gray-100" />
                              </div>}
                          </div>
                          <p>
                            {t.name}
                          </p>
                        </div>
                      </CustomRadio>
                      <div>
                        {t.knowledgeAbility && getTmplObj()?.knowledgeAbility ? knowContent : null}
                      </div>
                    </div>
                  ))}
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