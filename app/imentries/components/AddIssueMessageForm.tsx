'use client';

import DatePicker from "@/app/components/inputs/DatePicker";
import { contactArrayType } from "@/app/types";
import { Button, Card, CardBody, CardFooter, CardHeader, Spinner, Switch } from "@nextui-org/react";
import { PiTextTFill } from "react-icons/pi";
import { FaFileImage } from "react-icons/fa";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import MultilmediaUploader from "./MultilmediaUploader";


interface AddIssueMessageFormProps {
    contact: contactArrayType,
}

const AddIssueMessageForm: React.FC<AddIssueMessageFormProps> = ({
    contact,
}) => {
    const [isSending, setIsSending] = React.useState(false);
    const [isMedia, setIsMedia] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [mediaFiles, setMediaFiles] = React.useState<File[]>();
    const [issueDate, setIssueDate] = React.useState(new Date());

    const issueMessage = async () => {
        setIsSending(true);
        let postData: any;
        if (!isMedia) {
            postData = {
                recipientId: contact.id,
                message: message,
                issuedAt: issueDate,
                isTextMessage: true,
            }
        }
        else if (mediaFiles && mediaFiles.length > 0) {
                const formData = new FormData();

                for (const file of Array.from(mediaFiles ?? [])) {
                    formData.append(file.name, file);
                    //只发送最后一张图片，如果要发送全部图片，需要更改此函数逻辑
                    postData = {
                        recipientId: contact.id,
                        fileName: file.name,
                        issuedAt: issueDate,
                        isTextMessage: false,
                    }
                };

                await axios.post("/api/upload", formData);
        };

        if (postData)
            axios.post(`/api/imentries/addIssueMessage`, postData)
                .then((ret) => {
                    toast.success('发送消息成功!')
                    setMessage("");
                })
                .catch(() => toast.error('出错了!'))
                .finally(() => setIsSending(false));

    };

    return (
        <Card shadow="none" className="max-w-[386px] border-none bg-transparent overflow-visible">
            <CardHeader className="justify-between">
                <div className="flex gap-3">
                    <div className="flex flex-col items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">{contact.name}</h4>
                    </div>
                </div>
                <Button
                    className={isSending ? "bg-transparent text-foreground border-default-200" : ""}
                    color="primary"
                    radius="full"
                    size="sm"
                    variant={isSending ? "bordered" : "solid"}
                    onPress={issueMessage}
                    disabled={!isSending}
                >
                    {isSending ? <Spinner size="sm" /> : "发送"}
                </Button>
            </CardHeader>
            <CardBody className="px-3 py-0 w-96">
                <div className="flex flex-1 gap-2 mb-2 items-center justify-between">
                    <p className="text-default-500 text-small">消息内容</p>
                    <Switch
                        isSelected={isMedia}
                        onValueChange={setIsMedia}
                        size="md"
                        color="primary"
                        startContent={<FaFileImage />}
                        endContent={<PiTextTFill />}
                    />
                </div>
                {!isMedia && <textarea value={message} onChange={(e) => setMessage(e.target.value)} className='form-input
            block 
            w-full 
            h-full
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
                {isMedia && <MultilmediaUploader onChange={setMediaFiles} />}
            </CardBody>
            <CardFooter className="gap-3">
                <div className="flex gap-1 items-center">
                    <p className="text-default-500 text-small">发送时间</p>
                    <DatePicker
                        selected={issueDate}
                        onChange={(newDate) => setIssueDate(newDate!)}
                        placeholderText="选择日期"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="时间"
                        dateFormat="yyyy年MM月d日 h:mm aa"
                    />
                </div>
            </CardFooter>
        </Card>
    );
}

export default AddIssueMessageForm