'use client';

import { Robot } from "@prisma/client";
import ShareRobotBox from "./ShareRobotBox";
import clsx from "clsx";

interface ShareRobotListProps {
    items: Robot[];
}

const ShareRobotList: React.FC<ShareRobotListProps> = ({
    items,
}) => {
    return (
        <>
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
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
                {items.map((item) => (
                    <ShareRobotBox
                        key={item.id}
                        data={item}
                    />
                ))}
            </div>
        </>
    );
}

export default ShareRobotList;