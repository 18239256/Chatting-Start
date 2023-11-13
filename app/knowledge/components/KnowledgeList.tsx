'use client';

import { Knowledge, User } from "@prisma/client";
import KnowledgeBox from "./KnowledgeBox";
import clsx from "clsx";
import useKnowledge from "@/app/hooks/useKnowledge";
import KnowledgeModal from "./KnowledgeModal";
import { useState } from "react";
import { TbDatabasePlus } from "react-icons/tb";

interface KnowledgeListProps {
    items: Knowledge[];
    curUser: User | null;
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({
    items,
    curUser
}) => {
    const { knowledgeId, isOpen } = useKnowledge();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {curUser &&
                <KnowledgeModal
                    curUser={curUser}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />}
            <aside
                className={clsx(`
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
      `, isOpen ? 'hidden' : 'block w-full left-0')}
            >
                <div className="px-5">
                    <div className="flex justify-between mb-4 pt-4">
                        <div
                            className="
            text-2xl 
            font-bold 
            text-neutral-800 
          "
                        >
                            知识库
                        </div>
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
                            <TbDatabasePlus size={20} />
                        </div>
                    </div>
                    {items.map((item, index) => (
                        <KnowledgeBox key={item.id}
                            data={item}
                            selected={knowledgeId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
}

export default KnowledgeList;