'use client';

import { Role } from "@prisma/client";

interface BodyProps {
    role: Role;
}


const Body: React.FC<BodyProps> = ({ role}) => {
    return (
        <>
            <div className="flex-1 overflow-y-auto px-4">
                Role Body {role.name}
            </div>
        </>
    )
}

export default Body;