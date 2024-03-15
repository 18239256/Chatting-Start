'use client';

import { WXBasis, User, WXContacts } from "@prisma/client";
import WXContactBox from "./WXContactBox";
import clsx from "clsx";
import WXCreateModal from "./WXCreateModal";
import { useState } from "react";
import {Image,Avatar} from "@nextui-org/react";

interface WXAdminProps {
    wxBasis: WXBasis & {wxContacts : WXContacts[]};
    curUser: User | null;
}

const WXAdmin: React.FC<WXAdminProps> = ({
    wxBasis,
    curUser,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [online, setOnline] = useState(wxBasis.online);
    const contacts = wxBasis.wxContacts;
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
                <div className="flex justify-start mb-4 pt-4 gap-4 items-center">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        微信机器人配置
                    </div>
                    <Avatar isBordered 
                        color={online? "success":"default"}
                        className="w-4 h-4 text-tiny"
                        src=" " />
                </div>
                {!online && <Image 
                    src={wxBasis.qrUrl!}
                    width={300}
                    height={300}
                    alt="微信二维码"
                />}
                <div className="flex flex-col md:flex-row md:gap-4 md:flex-wrap md:justify-start flex-1">
                    {contacts?.map((contact) => (
                        <WXContactBox
                            key={contact.id}
                            data={contact}
                        />
                    ))}
                </div>
            </div>)}

        </>
    );
}

export default WXAdmin;