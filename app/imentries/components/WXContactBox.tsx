'use client';

import { WXContacts } from "@prisma/client";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiGroup, BiUser } from "react-icons/bi";
import { useMemo, useState } from "react";
import DatePicker from "@/app/components/inputs/DatePicker";


interface WXContactBoxProps {
  data: WXContacts;
}

const WXContactBox: React.FC<WXContactBoxProps> = ({
  data,
}) => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(data.name);
  const [alias, setAlias] = useState(data.alias);
  const [expiredDate, setexpiredDate] = useState(data.expired);

  const notExpired = useMemo(() => {
    return null === expiredDate || expiredDate! >= new Date();
  }, [expiredDate]);

  const setExpiredDate = async (newDate: Date) => {
    console.log('setExpiredDate called ', newDate);
    axios.post(`/api/users/update`, {
      id: data.id,
      expiredAt: newDate,
    }).then((ret) => {
      console.log(`成功更新有效期`, ret.data);
      router.refresh();
    })
      .catch(() => toast.error('出错了!'))
      .finally(() => setIsLoading(false));

    setexpiredDate(newDate);
  };

  const reset = () => {
    setName(data.name);
    setAlias(data.alias);
    setIsEdit(false);
  };

  const editBtn = () => {
    if (!isEdit) {
      setIsEdit(true);
    } else {
      axios.post('/api/mask/maskupdate', {
        id: data.id,
        title: name,
        content: alias,
        description: data.alias,
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
    <Card className="overflow-visible shrink-0 mb-4 max-w-1/2 basis-1/2 sm:max-w-1/3 sm:basis-1/3 lg:max-w-1/4 lg:basis-1/4">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          {data.isRoom ? (<BiGroup size={26} />) : (<BiUser size={26} />)}
          <div className="flex flex-col gap-1 items-start justify-center">
            {!isEdit && <h4 className="text-small font-semibold leading-none text-default-600">{name}</h4>}
            {isEdit && <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='form-input
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
      <CardBody className="px-3 py-0 text-small text-default-400 h-12">
        {!isEdit && <p>
          {alias}
        </p>}
      </CardBody>
      <CardFooter className="gap-3 justify-start">
        <div className="flex gap-1 items-center">
          <p className="text-default-400 text-small">有效期</p>
          <DatePicker
            selected={expiredDate}
            onChange={(date) => setExpiredDate(date!)}
            placeholderText="设定生效结束日期"
            isClearable
            warning={!notExpired}
            success={notExpired}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

export default WXContactBox;