'use client';

import { RobotMask } from "@prisma/client";
import { Card, CardHeader, CardBody, CardFooter, Button, Tooltip} from "@nextui-org/react";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiCustomerServiceFill, RiDeleteBinLine } from "react-icons/ri";
import ConfirmModal from "./ConfirmModal";

interface MaskBoxProps {
  mask: RobotMask;
}

const MaskBox: React.FC<MaskBoxProps> = ({
  mask,
}) => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(mask.title);
  const [content, setContent] = useState(mask.content);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const reset = () => {
    setTitle(mask.title);
    setContent(mask.content);
    setIsEdit(false);
  };

  const editBtn = () => {
    if (!isEdit) {
      setIsEdit(true);
    } else {
      axios.post('/api/mask/maskupdate', {
        id: mask.id,
        title: title,
        content: content,
        description: mask.description,
      })
        .then()
        .catch((err) => toast.error('保存修改时出错了!', err))
        .finally(() => {
          setIsEdit(false);
          router.refresh();
        });
    }
  };

  return (
    <> <ConfirmModal
      mask={mask}
      isOpen={confirmOpen}
      onClose={() => { setConfirmOpen(false); }}
    />
      <Card className="shrink-0 mb-1 basis-full md:basis-96 lg:basis-80">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <RiCustomerServiceFill size={26} className=" text-gray-400"/>
          <div className="flex flex-col gap-1 items-start justify-center">
            {!isEdit && <h4 className="text-small font-semibold leading-none text-default-600">{title}</h4>}
            {isEdit && <input type='text' value={title}  onChange={(e) => setTitle(e.target.value)} className='form-input
            block 
            w-full
            h-7
            rounded-md 
            border-0 
            py-1.5
            px-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6'></input>}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {isEdit &&
          <Button
            className={true ? "bg-transparent text-foreground border-default-200" : "bg-primary-300 hover:bg-primary-500"}
            color="primary"
            radius="full"
            size="sm"
            variant={true ? "bordered" : "solid"}
            onPress={() => reset()}
          >
            取消
          </Button>}
          <Button
            className="bg-primary-300 hover:bg-primary-500"
            color="primary"
            radius="full"
            size="sm"
            variant="solid"
            onPress={() => editBtn()}
          >
            {isEdit ? "保存" : "编辑"}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400 h-32">
        {!isEdit && <p>
          {content}
        </p>}
        {isEdit && <textarea value={content!} onChange={(e) => setContent(e.target.value)} className='form-input
            block 
            w-full 
            h-full
            rounded-md 
            border-0 
            py-1.5
            px-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6'></textarea>}
      </CardBody>
      <CardFooter className="gap-3 justify-between">
        <Tooltip color="danger" content="删除">
          <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() =>setConfirmOpen(true) } >
            <RiDeleteBinLine />
          </span>
        </Tooltip>
        <div className="flex gap-1">
          <h5 className="text-small tracking-tight text-default-400">{format(new Date(mask.createdAt), 'yyyy年MM月dd 创建')}</h5>
        </div>
      </CardFooter>
    </Card></>
  );
}

export default MaskBox;