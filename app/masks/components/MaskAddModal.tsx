'use client';

import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from 'react-hook-form';
import { User } from "@prisma/client";

import { toast } from 'react-hot-toast';
import Modal from '@/app/components/modals/Modal';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/inputs/Textarea';

interface MaskAddModalProps {
    isOpen?: boolean;
    onClose: () => void;
    curUser: User;
}

const MaskAddModal: React.FC<MaskAddModalProps> = ({ 
    isOpen, 
    onClose, 
    curUser
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
            title: '',
            content: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        const param = {
          title:data.title,
          content:data.content,
        };
      
        axios.post('/api/mask', param)
        .then((ret) => {
          router.refresh();
          onClose();
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
                新建岗位
              </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              创建一个新的岗位。
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="名称" 
                id="title" 
                errors={errors} 
                placeholder='请输入岗位名称'
                required 
                register={register}
              />
             
            </div>
            <div className="mt-10 flex flex-col gap-y-8">
              <Textarea
                disabled={isLoading}
                label="说明" 
                id="content" 
                errors={errors} 
                placeholder='请输入岗位说明'
                required 
                rows={8}
                register={register}
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

export default MaskAddModal;