'use client';

import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from 'react-hook-form';
import { RobotTemplate } from "@prisma/client";

import { toast } from 'react-hot-toast';
import Modal from '@/app/components/modals/Modal';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import Select from '@/app/components/inputs/Select';

interface RobotChatModalProps {
    isOpen?: boolean;
    onClose: () => void;
    robotTmpls: RobotTemplate[];
}

const RobotChatModal: React.FC<RobotChatModalProps> = ({ 
    isOpen, 
    onClose, 
    robotTmpls = []
  }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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
            robotTmpls: []
        }
    });

    const members = watch('members');

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
      
      // Create new robot user base on current logo in user
      axios.post('/api/robotregister', data)
        .then((callback) => {
          if (callback?.status) {
            toast.error('注册信息错误');
          }

          if (callback?.status) {
            toast.success('注册成功');
            router.push('/conversations')
          }
        })
        .catch(() => toast.error('出错了!'))
        .finally(() => setIsLoading(false));

      // Create new 1 by 1 conversation by new robot user
      axios.post('/api/conversations', {
        ...data,
        isGroup: true
      })
        .then(() => {
          router.refresh();
          onClose();
        })
        .catch(() => toast.error('Something went wrong!'))
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
              <Select
                disabled={isLoading}
                label="机器人模板" 
                options={robotTmpls.map((tmpl) => ({ 
                  value: tmpl.id, 
                  label: tmpl.name 
                }))} 
                onChange={(value) => setValue('robotTmpls', value, { 
                  shouldValidate: true 
                })} 
                value={members}
              />
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