'use client';

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { 
    FieldValues, 
    SubmitHandler, 
    useForm 
  } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import MessageInput from "./MessageInput";
import { useState } from "react";
import DelAllMsgConfirmModal from "./DelAllMsgConfirmModal";
import { BsFillEraserFill } from "react-icons/bs";

const Form =() => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const { conversationId } = useConversation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });
        axios.post('/api/messages', {
            ...data,
            conversationId: conversationId
        }).then(()=>
            //triggle robot to reply
            axios.post('/api/robot/robottalk', {
                ...data,
                conversationId: conversationId
            })
        );

        
    };

    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
          image: result?.info?.secure_url,
          conversationId: conversationId
        })
    };

    return (
        <>
            <DelAllMsgConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            />
            <div className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      ">
                {/* <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset="gvnviy91"
            ><HiPhoto size={30} className="text-sky-500" />
            </CldUploadButton> */}
                <button
                    onClick={() => setConfirmOpen(true)}
                    className="
                        rounded-full 
                        p-2 
                        bg-gray-200 
                        cursor-pointer 
                        hover:bg-red-500
                        transition
                    "
                >
                    <BsFillEraserFill
                        size={18}
                        className="text-white"
                    />
                </button>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center gap-2 lg:gap-4 w-full"
                >
                    <MessageInput
                        id="message"
                        register={register}
                        errors={errors}
                        required
                        placeholder="编写一条消息"
                    />
                    <button
                        type="submit"
                        className="
                        rounded-full 
                        p-2 
                        bg-sky-500 
                        cursor-pointer 
                        hover:bg-sky-600 
                        transition
                    "
                    >
                        <HiPaperAirplane
                            size={18}
                            className="text-white"
                        />
                    </button>
                </form>
            </div></>
    )
}
 
export default Form;