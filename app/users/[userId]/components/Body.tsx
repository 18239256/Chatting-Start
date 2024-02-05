'use client';

import { User } from "@prisma/client";
import RobotBox from "./RobotBox";
import { useState } from "react";

interface BodyProps {
    user: User & { robotUsers: User[] }
}

const Body: React.FC<BodyProps> = ({ user }) => {
    const [robotsCount,setRobotsCount] = useState(user.robotUsers.length);
    const [startDate, setStartDate] = useState(new Date());
    return (
        <>
            <div className="px-5">
                <div className="flex justify-start mb-4 pt-4 gap-2">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        拥有的机器人
                    </div>
                    <div className="text-sm font-light text-neutral-300">[{robotsCount}]</div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4 md:flex-wrap md:justify-start flex-1">
                    {user.robotUsers?.map((item) => (
                        <RobotBox
                            key={item.id}
                            data={item}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Body;