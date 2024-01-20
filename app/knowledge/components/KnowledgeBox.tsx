'use client';

import { Knowledge } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import format from "date-fns/format";
import { AiFillDatabase } from "react-icons/ai";
import { TbDatabaseShare, TbDatabase} from "react-icons/tb";

interface KnowledgeBoxProps {
  data: Knowledge,
  selected?: boolean
}

const KnowledgeBox: React.FC<KnowledgeBoxProps> = ({
  data,
  selected
}) => {
  const router = useRouter();
  useEffect(()=>{router.refresh();},[]);  //首次进入页面刷新数据
  
  const handleClick = useCallback(() => {
    router.push(`/knowledge/${data.id}`);
  }, [data, router]
  );

  return (
    <>
      <div
        onClick={handleClick}
        className={clsx(`
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
          `,
          selected ? 'bg-neutral-100' : 'bg-white'
        )}
      >
        <div className="min-w-0 flex-1">
          <Card className={clsx(`
          max-w
          hover:bg-neutral-100
          `,
          selected ? 'bg-neutral-100' : 'bg-white'
        )}
          >
            <CardHeader className="flex gap-3">
              <TbDatabase className="h-10 w-10" />
              <div className="flex flex-col">
                <p className="text-md">{data.displayName}</p>
                <p className="text-small text-default-500">{format(new Date(data.createdAt), 'yyyy年MM月dd 创建')}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>{data.description}</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <TbDatabaseShare className="h-6 w-6 text-default-500" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

export default KnowledgeBox;