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
                        岗位管理
                    </div>
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