'use client';

import React, { useState } from "react";
import Modal from '@/app/components/modals/Modal';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";

interface UploadfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    knowledgeName: string;
}

const UploadfileModal: React.FC<UploadfileModalProps> = ({
    isOpen,
    onClose,
    knowledgeName,
}) => {

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log('data', {...data});
        onClose();
    }

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
            email: '123@qq.com',
        }
    });

  return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
      >
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
                      添加文件
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                      为知识库 <b>{knowledgeName}</b> 添加文件
                  </p>
              </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input type="file" {...register('email')}></Input>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button
                      disabled={isLoading}
                      onClick={onClose}
                      type="button"
                  >
                      退出
                  </Button>
                  <Button disabled={isLoading} type="submit">
                      上传
                  </Button>
              </div>
          </form>
      </Modal>
  );
}

export default UploadfileModal