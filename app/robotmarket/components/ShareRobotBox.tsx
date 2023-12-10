'use client';

import { Robot, User } from "@prisma/client";
import { Card, CardHeader, CardBody, CardFooter, Button, Badge } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AvatarWithKB from "@/app/components/AvatarWithKB";
import Avatar from "@/app/components/Avatar";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface ShareRobotBoxProps {
  data: Robot & { user: User };
  curUser: User;
}

const ShareRobotBox: React.FC<ShareRobotBoxProps> = ({
  data,
  curUser,
}) => {
  const router = useRouter();
  const [isUsed, setIsUsed] = useState(data.consumeIds.includes(curUser?.id));
  const [isInvisible] = useState(curUser.id === data.user.robotOwnerId);

  useEffect(()=>{router.refresh();},[]);  //首次进入页面刷新数据

  const onPressFire=(isUsed:boolean)=>{
    if (isUsed) {
      // Create new 1 by 1 conversation by new robot user；
      // Then update model sharedRobotIds of model User with shared robot ID.
      axios.post('/api/conversations', { userId: data.userId })
        .then()
        .catch(() => toast.error('出错了!'))
        .finally(() => { router.refresh();});
    }else{
      axios.post('/api/robot/robotconsumecut', { robotId: data.id })
      .then()
      .catch(() => toast.error('出错了!'))
      .finally(() => { router.refresh(); });
    }
    setIsUsed(isUsed);
  }

  return (
    <Card className="w-80 max-w-lg">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Badge
            isOneChar
            content=""
            color="warning"
            shape="circle"
            placement="top-left"
            isInvisible={isInvisible}
          >
            {Boolean(data.knowledgeBaseName) ? (
              <AvatarWithKB user={data.user} />
            ) : (
              <Avatar user={data.user} />
            )}</Badge>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{data.name}</h4>
            <h5 className="text-small tracking-tight text-default-400">{format(new Date(data.createdAt), 'yyyy年MM月dd 创建')}</h5>
          </div>
        </div>
        <Button
          className={isUsed ? "bg-transparent text-foreground border-default-200" : "bg-primary-300 hover:bg-primary-500"}
          color="primary"
          radius="full"
          size="sm"
          variant={isUsed ? "bordered" : "solid"}
          onPress={() => onPressFire(!isUsed)}
        >
          {isUsed ? "停用" : "启用"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>
          {data.description}
        </p>

      </CardBody>
      <CardFooter className="gap-3 justify-between">
        <div className="flex gap-1">
          <p className="text-default-400 text-small">幻想度</p>
          <p className="font-semibold text-default-400 text-small">{data.temperature}</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">{data.consumeIds.length}</p>
          <p className="text-default-400 text-small">人在使用</p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ShareRobotBox;