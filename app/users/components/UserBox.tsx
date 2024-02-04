import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {  User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/modals/LoadingModal";
import clsx from "clsx";

interface UserBoxProps {
  data: User,  
  selected?: boolean
}

const UserBox: React.FC<UserBoxProps> = ({ 
  data,
  selected,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    router.push(`/users/${data.id}`);
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
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {data.name}
              </p>
            </div>
            <div className="text-sm font-light text-neutral-400">
              {data.email}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default UserBox;