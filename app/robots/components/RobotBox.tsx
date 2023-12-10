'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import Avatar from "@/app/components/Avatar";
import {FullRobotConversationType } from "@/app/types";
import useRobotOtherUser from "@/app/hooks/useRobotOtherUser";
import AvatarWithKB from "@/app/components/AvatarWithKB";
import { Badge } from "@nextui-org/react";
import useCurrentUser from "@/app/hooks/useCurrentUser";

interface RobotBoxProps {
    data: FullRobotConversationType,
    selected?: boolean;
}

const RobotBox: React.FC<RobotBoxProps> = ({
    data,
    selected
}) => {
    const otherRobotUser = useRobotOtherUser(data);
    const curUser = useCurrentUser(data);
    const session = useSession();
    const router = useRouter();

    useEffect(()=>{router.refresh();},[]);  //首次进入页面刷新数据

    const handleClick = useCallback(() => {
        router.push(`/robots/${data.id}`);
    }, [data, router]
    );

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];

        return messages[messages.length - 1];
    }, [data.messages]
    );

    const userEmail = useMemo(() => session.data?.user?.email,
        [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }

        const seenArray = lastMessage.seen || [];

        if (!userEmail) {
            return false;
        }

        return seenArray
            .filter((user) => user.email === userEmail).length !== 0;
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image';
        }

        if (lastMessage?.body) {
            return lastMessage?.body
        }

        return '请开始对话';
    }, [lastMessage]);

    return (
        <div
        onClick={handleClick}
        className={clsx(`
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
          `,
          selected ? 'bg-neutral-100' : 'bg-white'
        )}
      >
        <Badge
          isOneChar
          content=""
          color="warning"
          shape="circle"
          placement="top-left"
          isInvisible={curUser?.id == otherRobotUser.robotOwnerId}
        >
          {otherRobotUser && Boolean(otherRobotUser.robot?.knowledgeBaseName) ? (
            <AvatarWithKB user={otherRobotUser} />
          ) : (
            <Avatar user={otherRobotUser} />
          )}</Badge>
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-md font-medium text-gray-900">
                {data.name || (otherRobotUser && otherRobotUser.name)}
              </p>
              {lastMessage?.createdAt && (
                <p 
                  className="
                    text-xs 
                    text-gray-400 
                    font-light
                  "
                >
                  {format(new Date(lastMessage.createdAt), 'p')}
                </p>
              )}
            </div>
            <p 
              className={clsx(`
                truncate 
                text-sm
                `,
                hasSeen ? 'text-gray-500' : 'text-black font-medium'
              )}>
                {lastMessageText}
              </p>
          </div>
        </div>
      </div>
    );
}

export default RobotBox