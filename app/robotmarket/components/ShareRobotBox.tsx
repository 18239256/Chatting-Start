'use client';

import { Robot, User } from "@prisma/client";
import {Card, CardHeader, CardBody, CardFooter, Button} from "@nextui-org/react";
import { useState } from "react";
import { format } from "date-fns";
import AvatarWithKB from "@/app/components/AvatarWithKB";
import Avatar from "@/app/components/Avatar";


interface ShareRobotBoxProps {
    data: Robot & {user: User},
  }

  const ShareRobotBox: React.FC<ShareRobotBoxProps> = ({
    data,
  }) => {
    const [isFollowed, setIsFollowed] = useState(false);

    return (
      <Card className="max-w-lg">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
            {Boolean(data.knowledgeBaseName) ? (
              <AvatarWithKB user={data.user} />
            ) : (
              <Avatar user={data.user} />
            )}
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{data.name}</h4>
            <h5 className="text-small tracking-tight text-default-400">{format(new Date(data.createdAt), 'yyyy年MM月dd 创建')}</h5>
          </div>
        </div>
        <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <p>
            记录{data.historyRound}轮对话。
          </p>
          <span className="pt-2">
            幻想度{data.temperature}
          </span>
        </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">{data.consumeIds.length}</p>
          <p className="text-default-400 text-small">人在使用</p>
        </div>
      </CardFooter>
    </Card>
    );
  }
  
  export default ShareRobotBox;