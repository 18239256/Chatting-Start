'use client';

import React, { useState } from "react";
import Modal from '@/app/components/modals/Modal';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { Knowledge } from "@prisma/client";
import { File } from "buffer";
import { stringify } from "querystring";

interface UploadfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    knowledge: Knowledge;
}

const UploadfileModal: React.FC<UploadfileModalProps> = ({
    isOpen,
    onClose,
    knowledge,
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [uploadFiles, setUploadFiles] = useState(['']);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log('data', { ...data });
        const form = new FormData();
        form.append("knowledge_base_name", knowledge.realName);
        let fileLength = data.files.length;
        let i = 0;
        while (i < fileLength) {
            let file = data.files[i];
            form.append("files", file);
            i++;
        }
        axios.post('https://u154745-87ee-9e7dd061.westx.seetacloud.com:8443/api/knowledge_base/upload_docs', form)
        .then((res)=>{
            console.log('res', res);
            toast.success('上传成功!');
        })
        .catch(() => toast.error('出错了!'))
        .finally();
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
        }
    });

    const fileSelected = (data: any) => {
        let files = data.target.files;
        let fileLength = files.length;
        let i = 0;
        let fileNames = [];
        while (i < fileLength) {
            let file = files[i];
            fileNames.push(file.name);
            i++;
        }
        setUploadFiles([...fileNames]);
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-2">
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
                            为知识库 <b>{knowledge.displayName}</b> 添加文件
                        </p>
                    </div>
                    <div>
                        <label htmlFor="files" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <div className=" border-2 border-red-400 flex justify-center">
                            <span>Upload a file</span>
                            </div>
                        </label>
                        <p><input id="files" type="file" {...register('files')} onChange={fileSelected} className="sr-only" multiple></input></p>
                        {uploadFiles.map((f,index)=>(<div key={index}>{f}</div>))}
                    </div>
                    <div>
                        <Button disabled={isLoading} type="submit" color="primary" variant="flat">
                            上传
                        </Button>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                        disabled={isLoading}
                        onClick={onClose}
                        type="button"
                        radius="md"
                    >
                        退  出
                    </Button>
                    
                </div>
            </form>
        </Modal>
    );
}

export default UploadfileModal