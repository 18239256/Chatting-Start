'use client';

import { Card, CardHeader, CardBody, CardFooter, Button, Badge, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AvatarWithKB from "@/app/components/AvatarWithKB";
import Avatar from "@/app/components/Avatar";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FullUserType } from "@/app/types";
import Datepicker from "@/app/components/inputs/Datepicker";
import { RiDeleteBinLine } from "react-icons/ri";


interface RobotBoxProps {
  data: FullUserType;
}

const RobotBox: React.FC<RobotBoxProps> = ({
  data,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const router = useRouter();

  const removeRobot = async () => {
    if (confirm("确认删除机器人?"))   //后续优化这个确认对话框
      // axios.post(`/api/knowledges/deletedocs`, { knowledgeBaseName: knowledgeRN, file_names: file_names })
      //   .then((ret) => {
      //     toast.success(`已经成功删除`);
      //     router.refresh();
      //   })
      //   .catch(() => toast.error('出错了!'))
      //   .finally(() => {})
    return;
  };

  return (
    <Card className="overflow-visible shrink-0 mb-1 max-w-0.5 basis-1/2 sm:max-w-1/3 sm:basis-1/3 lg:max-w-1/4 lg:basis-1/4 ">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          {Boolean(data.robot?.knowledgeBaseName) ? (
            <AvatarWithKB user={data} />
          ) : (
            <Avatar user={data} />
          )}
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{data.name}</h4>
            <h5 className="text-small tracking-tight text-default-400">{format(new Date(data.createdAt), 'yyyy年MM月dd 创建')}</h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400 h-8 ">
        <p>
          {data.email}
        </p>
      </CardBody>
      <CardFooter className="gap-3 justify-between">
        <div className="flex gap-1 items-center">
          <p className="text-default-400 text-small">有效期</p>
          <Datepicker
            selected={startDate}
            onChange={(date) => setStartDate(date!)}
          />
        </div>
        <Tooltip color="danger" content="删除机器人">
          <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={removeRobot}>
            <RiDeleteBinLine />
          </span>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

export default RobotBox;