'use client';

import { Knowledge } from "@prisma/client";
import KnowledgeBox from "./KnowledgeBox";
import clsx from "clsx";
import useKnowledge from "@/app/hooks/useKnowledge";

interface KnowledgeListProps {
    items: Knowledge[];
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({
    items,
}) => {
    const { knowledgeId, isOpen } = useKnowledge();
    console.log('isOpen:', isOpen);
    return (<aside
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
            <div className="flex-col">
                <div
                    className="
            text-2xl 
            font-bold 
            text-neutral-800 
            py-4
          "
                >
                    知识库
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
    );
}

export default KnowledgeList;