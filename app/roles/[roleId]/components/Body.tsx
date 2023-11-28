'use client';

import { Role, User } from "@prisma/client";
import { Listbox, ListboxItem, Chip, ScrollShadow, Selection, Button, Select } from "@nextui-org/react";
import Avatar from "@/app/components/Avatar";
import { ListboxWrapper } from "./ListboxWrapper";
import { Key, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BodyProps {
    role: Role;
    users: User[];
}

function arrayEqual(a:Key[], b:Key[]) {
    //先将数组排序
    a = a.sort();
    b = b.sort();
    //判断数组长度是否相等，若不相等返回false
    if (a.length != b.length) 
    return false;
    //逐个比较数组元素
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) 
        return false;
    }
    return true;
}

const Body: React.FC<BodyProps> = ({ role, users = [] }) => {
    const [values, setValues] = useState<Selection>(new Set(role.assignIds));
    const arrayValues = Array.from(values);
    const [dirty, setDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if(values === "all")
            setDirty(!arrayEqual(role.assignIds, [...users.map((u)=>u.id)]));
        else
            setDirty(!arrayEqual(role.assignIds, Array.from(values)));
    }, [role.assignIds, values]);

    const topContent = useMemo(() => {
        if (!arrayValues.length) {
            return null;
        } return (
            <ScrollShadow
                // hideScrollBar
                className="w-full flex py-0.5 px-2 gap-1"
                orientation="horizontal"
            >
                {arrayValues.map((value) => (
                    <Chip key={value}>{users.find((user) => `${user.id}` === `${value}`)?.name}</Chip>
                ))}
            </ScrollShadow>
        );
    }, [arrayValues.length]);

    const saveModify = () =>{
        setIsLoading(true);
        const param={
            roleId: role.id,
            assignIds: values === "all"? [...users.map((u)=>u.id)] : arrayValues
        }
        axios.post('/api/role/addUsers', param)
        .then((callback) => {
          if (callback?.status !== 200) {
            toast.error('保存失败');
          }
  
          if (callback?.status == 200) {
            toast.success('保存成功');
            setDirty(false);
          }
        })
        .catch((err) => toast.error(`${err}`))
        .finally(() => {
            setIsLoading(false);
            router.refresh();
        });
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex justify-between overflow-y-auto py-4">
                    <div className="py-2">用户管理</div>
                    <div>
                        <Button color="primary" disabled={!dirty || isLoading} className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200" onClick={saveModify}>
                            保存修改
                        </Button>
                    </div>
                </div>
                <ListboxWrapper>
                    <Listbox
                        topContent={topContent}
                        classNames={{
                            base: "max-w-[100%]",
                            list: "max-h-[600px] overflow-scroll",
                        }}
                        defaultSelectedKeys={values}
                        items={users}
                        label="Assigned to"
                        selectionMode="multiple"
                        onSelectionChange={setValues}
                        variant="flat"
                    >
                        {(item) => (
                            <ListboxItem key={item.id} textValue={item.name||""}>
                                <div className="flex gap-2 items-center">
                                    <Avatar user={item} />
                                    <div className="flex flex-col">
                                        <span className="text-small">{item.name}</span>
                                        <span className="text-tiny text-default-400">{item.email}</span>
                                    </div>
                                </div>
                            </ListboxItem>
                        )}
                    </Listbox>
                </ListboxWrapper>
            </div>
        </>
    )
}

export default Body;