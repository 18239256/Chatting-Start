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


interface RobotBoxProps {
  data: User;
}

const RobotBox: React.FC<RobotBoxProps> = ({
  data,
}) => {
  const router = useRouter();
  return (
    <Card className="shrink-0 mb-1 max-w-0.5 basis-1/2 sm:max-w-1/3 sm:basis-1/3 lg:max-w-1/4 lg:basis-1/4">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Badge
            isOneChar
            content=""
            color="warning"
            shape="circle"
            placement="top-left"
            isInvisible={false}
          >
            {Boolean(false) ? (
              <AvatarWithKB user={data} />
            ) : (
              <Avatar user={data} />
            )}</Badge>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{data.name}</h4>
            <h5 className="text-small tracking-tight text-default-400">{format(new Date(data.createdAt), 'yyyy年MM月dd 创建')}</h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400 h-8">
        <p>
          {data.email}
        </p>
      </CardBody>
      <CardFooter className="gap-3 justify-between">
            
      </CardFooter>
    </Card>
  );
}

export default RobotBox;