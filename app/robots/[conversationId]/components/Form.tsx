'use client';

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { 
    FieldValues, 
    SubmitHandler, 
    useForm 
  } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { CldUploadButton } from "next-cloudinary";
import MessageInput from "./MessageInput";
import deleteAllMessages from "@/app/actions/deleteMessages";
import toast from "react-hot-toast";

const Form =() => {

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
        });

        //triggle robot to reply
        axios.post('/api/robottalk', {
            ...data,
            conversationId: conversationId
        })
    };

    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
          image: result?.info?.secure_url,
          conversationId: conversationId
        })
    };

    const handleDelAll = () => {
        console.log(`/api/messages/${conversationId}/deleteall`);
        axios.post(`/api/messages/${conversationId}/deleteall`);
    };
    
    return (
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
                onClick={handleDelAll}
                className="
                        rounded-full 
                        p-2 
                        bg-gray-500 
                        cursor-pointer 
                        hover:bg-red-600
                        transition
                    "
            >
                <RiDeleteBin4Fill
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
        </div>
    )
}
 
export default Form;