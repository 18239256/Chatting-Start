'use client';

import { Robot, User } from "@prisma/client";
import MaskBox from "./MaskBox";
import clsx from "clsx";

interface MaskListProps {
    items: (Robot & {user: User})[];
    curUser: User;
}

const MaskList: React.FC<MaskListProps> = ({
    items,
    curUser,
}) => {
    return (
        <>
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4 gap-2">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        面具配置
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-6">
                    {items?.map((item) => (
                        <MaskBox
                            key={item.id}
                            data={item}
                            curUser={curUser}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default MaskList;