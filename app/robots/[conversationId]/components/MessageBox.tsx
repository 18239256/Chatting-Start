'use client';

import clsx from "clsx";
import Image from "next/image";
import { FullMessageType } from "@/app/types";
import { useSession } from "next-auth/react";

import Avatar from "@/app/components/Avatar";
import { format } from "date-fns";
import ImageModal from "./ImageModal";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm'
import React from "react";
import { Accordion, AccordionItem, Link } from "@nextui-org/react";
import { format as url_format } from "url";
import toast from "react-hot-toast";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data?.sender?.email
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden leading-loose',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    data.image ? 'rounded-md p-0' : 'rounded-lg py-2 px-3'
  );

  const downloadDoc = async (knowledgeRN: string, file_name: string) => {
    const apiUrl = url_format({
      protocol: process.env.LLM_API_PROTOCOL,
      hostname: "region-31.seetacloud.com",
      port: "38744",
      pathname: "/api/knowledge_base/download_doc",
      query: {
        knowledge_base_name: knowledgeRN,
        file_name: file_name,
        preview: false
      }
    });


    try {

      const result = await fetch(apiUrl);
      const blob = await result.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file_name;
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      toast.error(`下载出错了：${error}}`);
    }

    return;
  };

  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium text-sky-500",
    trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };

  const renderRefDocs = React.useMemo(() => {
    if (!data.referenceDocs)
      return "";

    const reg = RegExp(/\[(.*?)\]/);
    const refDocs: string[] = JSON.parse(data.referenceDocs);
    return (
      <Accordion itemClasses={itemClasses}>
        <AccordionItem key="1" aria-label="mathresult" title="匹配详情" className="text-xs">
          <ul className="list-reset">
            {refDocs.map((ref) => {
              const fistStrip = ref.split("\n\n");
              const secondStrip = fistStrip[0].split(" ");
              const fileName = secondStrip[2].match(reg);
              if (fileName)
                return (<li key={secondStrip[1]} className="leading-10 text-base">{secondStrip[1]} <Link href="#" className="text-sky-500" onClick={() => downloadDoc("John", fileName[1])}>{fileName[1]}</Link><p>{fistStrip[1]}</p></li>);
            })}
          </ul>
        </AccordionItem>
      </Accordion>
    );
  }, [data]);

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender.name}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              // loader={()=>{return data.image;}}  //如果出现图片加载失败，打开此处代码即可更正
              className="
                  object-cover 
                  cursor-pointer 
                  hover:scale-110 
                  transition 
                  translate
                "
            />
          ) : (
            <div><ReactMarkdown remarkPlugins={[gfm]}>{data.body}</ReactMarkdown>
              {renderRefDocs}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
              text-xs 
              font-light 
              text-gray-500
              "
          >
            {`${seenList} 已读`}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBox;