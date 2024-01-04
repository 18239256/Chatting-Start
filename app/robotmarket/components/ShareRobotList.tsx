'use client';

import { Robot, User } from "@prisma/client";
import ShareRobotBox from "./ShareRobotBox";
import clsx from "clsx";

interface ShareRobotListProps {
    items: (Robot & {user: User})[];
    curUser: User;
}

const ShareRobotList: React.FC<ShareRobotListProps> = ({
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
                        机器人市场
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row md:gap-6 lg:pr-20">
                    {items?.map((item) => (
                        <ShareRobotBox
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

export default ShareRobotList;