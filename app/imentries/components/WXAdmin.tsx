'use client';

import { WXBasis, User } from "@prisma/client";
import WXContactBox from "./WXContactBox";
import clsx from "clsx";
import WXCreateModal from "./WXCreateModal";
import { useState } from "react";
import { stringify } from "querystring";

interface WXAdminProps {
    wxBasis: WXBasis;
    curUser: User | null;
}

const WXAdmin: React.FC<WXAdminProps> = ({
    wxBasis,
    curUser,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <WXCreateModal
                curUser={curUser!}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            {wxBasis == null ? (<div
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
            </div>) 
            : (<div className="px-5">
                <div className="flex justify-between mb-4 pt-4 gap-2">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        微信机器人配置
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row md:gap-6 lg:pr-20">
                    {/* {items?.map((item) => (
                        <WXContactBox
                            key={item.id}
                            data={item}
                        />
                    ))} */}
                </div>
            </div>)}

        </>
    );
}

export default WXAdmin;