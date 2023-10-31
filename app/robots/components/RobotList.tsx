'use client';

import { RobotTemplate } from "@prisma/client";
import { FullConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import useConversation from "@/app/hooks/useConversation";
import RobotBox from "./RobotBox";
import RobotChatModal from "./RobotChatModal";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import { FaRobot } from "react-icons/fa6";


interface RobotListProps {
    initialItems: FullConversationType[];
    robotTmpls: RobotTemplate[];
    title?: string;
}

const RobotList: React.FC<RobotListProps> = ({ 
    initialItems, 
    robotTmpls
  }) =>{

    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const router = useRouter();
    const session = useSession();
  
    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
      return session.data?.user?.email
    }, [session.data?.user?.email])

    useEffect(() => {
      if (!pusherKey) {
        return;
      }
  
      pusherClient.subscribe(pusherKey);
  
      const updateHandler = (conversation: FullConversationType) => {
        setItems((current) => current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages
            };
          }
  
          return currentConversation;
        }));
      }
  
      const newHandler = (conversation: FullConversationType) => {
        setItems((current) => {
          if (find(current, { id: conversation.id })) {
            return current;
          }
  
          return [conversation, ...current]
        });
      }
  
      const removeHandler = (conversation: FullConversationType) => {
        setItems((current) => {
          return [...current.filter((convo) => convo.id !== conversation.id)]
        });
        
        // fresh new codes
        if(conversationId === conversation.id){
          router.push('/robots');
        }
      }
  
      pusherClient.bind('conversation:update', updateHandler)
      pusherClient.bind('conversation:new', newHandler)
      pusherClient.bind('conversation:remove', removeHandler)

      // fresh new codes
      return () => {
        pusherClient.unsubscribe(pusherKey);
        pusherClient.unbind('conversation:update', updateHandler)
        pusherClient.unbind('conversation:new', newHandler)
        pusherClient.unbind('conversation:remove', removeHandler)

      }
    }, [pusherKey, conversationId, router]);

    return (
      <>
        <RobotChatModal
          robotTmpls={robotTmpls}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <aside className={clsx(`
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
          <div className="px-5">
            <div className="flex justify-between mb-4 pt-4">
              <div className="text-2xl font-bold text-neutral-800">
                机器人
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
              >
                <FaRobot size={20} />
              </div>
            </div>
            {items.map((item) => (
              <RobotBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            ))}
          </div>
        </aside>
      </>
    );
}

export default RobotList;
