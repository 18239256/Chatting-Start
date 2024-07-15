'use client';

import { Knowledge, RobotTemplate } from "@prisma/client";
import { FullConversationType, FullRobotConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import useConversation from "@/app/hooks/useConversation";
import RobotBox from "./RobotBox";
import RobotChatModal from "./RobotChatModal";
import { RMQC } from "@/app/libs/RMQClient";
import { find } from "lodash";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import { Tooltip } from "@nextui-org/react";


interface RobotListProps {
    knowledges:Knowledge[];
    initialItems: FullRobotConversationType[];
    robotTmpls: RobotTemplate[];
    title?: string;
}

const RobotList: React.FC<RobotListProps> = ({ 
    knowledges,
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
    }, [session.data?.user?.email]);

    //当初始值改变后，需要重新初始化items变量，否则列表状态还是第一次初始化的值
    useMemo(()=>{
      setItems(initialItems);
    },[initialItems]);

    useEffect(() => {
      if (!pusherKey) {
        return;
      }
      RMQC.subscribe(pusherKey);
  
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
  
      const newHandler = (conversation: FullRobotConversationType) => {
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
        // fresh client
        if(conversationId === conversation.id){
          router.push('/robots');
        }
      }
  
      RMQC.bind('conversation:update', updateHandler)
      RMQC.bind('conversation:new', newHandler)
      RMQC.bind('conversation:remove', removeHandler)

      // fresh new codes
      return () => {
        RMQC.unsubscribe(pusherKey);
        RMQC.unbind('conversation:update', updateHandler)
        RMQC.unbind('conversation:new', newHandler)
        RMQC.unbind('conversation:remove', removeHandler)

      }
    }, [pusherKey, conversationId, router]);

    return (
      <>
        <RobotChatModal
          knowledges={knowledges}
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
              <Tooltip className=" bg-sky-500 text-gray-50" content="创建机器人">
              <div
                onClick={() => setIsModalOpen(true)}
                className="
                rounded-full 
                p-2 
                bg-sky-500 
                hover:bg-sky-600 
                text-white
                cursor-pointer 
                hover:opacity-75 
                transition
              "
              >
                <BiSolidMessageRoundedAdd size={20} />
              </div>
              </Tooltip>
            </div>
            {items.map((item) => (
              <RobotBox
                key={item?.id}
                data={item}
                selected={conversationId === item?.id}
              />
            ))}
          </div>
        </aside>
      </>
    );
}

export default RobotList;
