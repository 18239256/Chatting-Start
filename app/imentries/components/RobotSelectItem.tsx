'use client';

import Avatar from "@/app/components/Avatar";
import AvatarWithKB from "@/app/components/AvatarWithKB";
import AvatarWithSearch from "@/app/components/AvatarWithSearch";
import useCurrentUser from "@/app/hooks/useCurrentUser";
import useRobotOtherUser from "@/app/hooks/useRobotOtherUser";
import { FullRobotConversationType } from "@/app/types";
import { Badge } from "@nextui-org/react";


interface RobotSelectItemProps {
    data: FullRobotConversationType,
}

const RobotSelectItem: React.FC<RobotSelectItemProps> = ({
    data,
}) => {
    const otherRobotUser = useRobotOtherUser(data);
    const curUser = useCurrentUser(data);

    return (
        <div className="flex flex-row items-center">
            <Badge
                isOneChar
                content=""
                color="warning"
                shape="circle"
                placement="top-left"
                isInvisible={curUser?.id == otherRobotUser.robotOwnerId}
            >
                {Boolean(otherRobotUser.robot?.knowledgeBaseName) ? (
                    <AvatarWithKB user={otherRobotUser} />
                ) : (Boolean(otherRobotUser.robot?.searchEngineName) ?
                    <AvatarWithSearch user={otherRobotUser} />
                    : <Avatar user={otherRobotUser} />
                )}
            </Badge>
            {otherRobotUser.name}
        </div>
    );
}

export default RobotSelectItem