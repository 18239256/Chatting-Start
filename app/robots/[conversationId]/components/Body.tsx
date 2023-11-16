'use client';

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType, FullRobotMessageType } from "@/app/types";

import { useEffect, useRef, useState } from "react";

import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullRobotMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullRobotMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message]
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullRobotMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }

        return currentMessage;
      }))
    };

    const delAllMessageHandler = () => {
      setMessages((current) => {
        return []
      });
      bottomRef?.current?.scrollIntoView();
    };


    pusherClient.bind('messages:new', messageHandler)
    // pusherClient.bind('message:update', updateMessageHandler); //防止消息更新触发后引起消息显示控件无法获得knowledgeName的bug，因为发送消息时候消息信息不完整
    pusherClient.bind('message:deleteall', delAllMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      // pusherClient.unbind('message:update', updateMessageHandler)
      pusherClient.unbind('message:deleteall', delAllMessageHandler)
    }
  }, [conversationId]);


  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  )
}

export default Body;