'use client';

import DatePicker from "@/app/components/inputs/DatePicker";
import { contactArrayType } from "@/app/types";
import { Button, Card, CardBody, CardFooter, CardHeader, Spinner } from "@nextui-org/react";
import axios from "axios";
import React from "react";
import toast, { ToastIcon } from "react-hot-toast";


interface AddIssueMessageFormProps {
    contact: contactArrayType,
}

const AddIssueMessageForm: React.FC<AddIssueMessageFormProps> = ({
    contact,
}) => {
    const [isSending, setIsSending] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [issueDate, setIssueDate] = React.useState(new Date());

    const issueMessage = async () => {
        setIsSending(true);
        axios.post(`/api/imentries/addIssueMessage`, {
            recipientId: contact.id,
            message: message,
            issuedAt: issueDate,
        }).then((ret) => {
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
                <p className="text-default-500 text-small">消息内容</p>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className='form-input
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
            sm:leading-6'></textarea>
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