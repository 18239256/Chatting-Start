'use client';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {  Role } from "@prisma/client";

import AvatarRole from "@/app/components/AvatarRole";
import LoadingModal from "@/app/components/modals/LoadingModal";
import clsx from "clsx";

interface RoleBoxProps {
  data: Role,
  selected?: boolean
}

const RoleBox: React.FC<RoleBoxProps> = ({ 
  data,
  selected
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    router.push(`/roles/${data.id}`);
  }, [data, router]);

  return (
    <>
      {isLoading && (
        <LoadingModal />
      )}
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
        <AvatarRole role={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default RoleBox;