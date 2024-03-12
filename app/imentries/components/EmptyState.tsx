import { useState } from "react";
import WXCreateModal from "./WXCreateModal";
import getCurrentUser from "@/app/actions/getCurrentUser";

const EmptyState = async () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = await getCurrentUser();

  return (
    <>
      <WXCreateModal
        curUser={user!}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div
        className="
          px-4 
          py-10 
          sm:px-6 
          lg:px-8 
          lg:py-6 
          h-full 
          flex 
          justify-center 
          items-center 
          bg-gray-100
        "
      >
        <div className="text-center items-center flex">
          <h3 className="mt-2 text-2xl font-semibold text-gray-300">
            没有开通微信机器人，
          </h3>
          <h3
            onClick={() => setIsModalOpen(true)}
            className="mt-2 text-2xl font-semibold text-sky-500 underline cursor-pointer">
            创建一个?</h3>
        </div>
      </div>
    </>
  );
}

export default EmptyState;