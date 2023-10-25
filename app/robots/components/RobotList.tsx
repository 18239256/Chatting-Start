'use client';

import { FullRobotTalkType } from "@/app/types";
import { Robot } from "@prisma/client";

interface RobotListProps {
    robots: Robot[];
    initialTalks: FullRobotTalkType[];
}

const RobotList: React.FC<RobotListProps> = ({ 
    initialTalks
  }) => {
    return (
        <div>
            Robot List Page.
        </div>
    )
}

export default RobotList;