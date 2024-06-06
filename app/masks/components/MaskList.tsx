'use client';

import { RobotMask, User } from "@prisma/client";
import MaskBox from "./MaskBox";
import { Tooltip } from "@nextui-org/react";
import { RiCustomerServiceFill } from "react-icons/ri";
import { useState } from "react";
import MaskAddModal from "./MaskAddModal";


interface MaskListProps {
    items: RobotMask[];
    curUser: User;
}

const MaskList: React.FC<MaskListProps> = ({
    items,
    curUser,
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    return (
        <>
            <MaskAddModal
                curUser={curUser}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4 gap-2">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        岗位管理
                    </div>
                    <Tooltip className=" bg-sky-500 text-gray-50" content="添加岗位">
                        <div onClick={() => setIsAddModalOpen(true)}>
                            <RiCustomerServiceFill size={26} className="text-sky-500 hover:text-sky-600 hover:cursor-pointer " />
                        </div>
                    </Tooltip>
                </div>
                <div className="flex flex-col justify-start flex-1 md:flex-row md:flex-wrap md:justify-start md:gap-6">
                    {items?.map((item) => (
                        <MaskBox
                            key={item.id}
                            data={item}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default MaskList;