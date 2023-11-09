'use client';

import { Knowledge } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface KnowledgeBoxProps {
  data: Knowledge,
  selected?: boolean
}

const KnowledgeBox: React.FC<KnowledgeBoxProps> = ({
  data,
  selected
}) => {
  const router = useRouter();
  const handleClick = useCallback(() => {
      router.push(`/knowledge/${data.id}`);
  }, [data, router]
  );

  return (
    <>
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
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-md font-medium text-gray-900">
                {data.displayName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default KnowledgeBox;