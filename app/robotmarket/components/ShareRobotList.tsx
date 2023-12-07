'use client';

import { Robot } from "@prisma/client";
import ShareRobotBox from "./ShareRobotBox";

interface ShareRobotListProps {
    items: Robot[];
}

const ShareRobotList: React.FC<ShareRobotListProps> = ({
    items,
}) => {
    return (
        <>
            {items.map((item) => (
                <ShareRobotBox
                    key={item.id}
                    data={item}
                />
            ))}
        </>
    );
}

export default ShareRobotList;