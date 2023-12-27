'use client';

import { RobotMask } from "@prisma/client";
import MaskBox from "./MaskBox";
import clsx from "clsx";

interface MaskListProps {
    items: RobotMask[];
}

const MaskList: React.FC<MaskListProps> = ({
    items,
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
                <div className="flex flex-col md:flex-row md:gap-6 lg:pr-20">
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