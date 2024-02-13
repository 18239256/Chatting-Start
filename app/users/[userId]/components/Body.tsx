'use client';

import { Role, User } from "@prisma/client";
import RobotBox from "./RobotBox";
import { Key, useEffect, useMemo, useState } from "react";
import { FullUserType } from "@/app/types";
import { ListboxWrapper } from "@/app/components/lists/ListboxWrapper";
import { Button, Chip, Listbox, ListboxItem, ScrollShadow, Selection } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AvatarRole from "@/app/components/AvatarRole";

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

interface BodyProps {
    user: User & { robotUsers: FullUserType[], assignRole: Role[]},
    roles: Role[],
}

const Body: React.FC<BodyProps> = ({ user, roles }) => {
    const [robotsCount,setRobotsCount] = useState(user.robotUsers.length);
    const [rolesCount,setRolesCount] = useState(user.assignRole.length);    
    const [userRoles, setUserRoles] = useState<Selection>(new Set(user.assignRoleIds));
    const arrayUserRoles = Array.from(userRoles);    
    const [dirtyOfUserRoles, setDirtyOfUserRoles] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const saveModify = () => {
        setIsLoading(true);
        
        //更新用户变更信息
            const param = {
                id: user.id,
                assignRoleIds: dirtyOfUserRoles? (userRoles === "all" ? [...roles.map((u) => u.id)] : arrayUserRoles) : null,
            }
            axios.post('/api/users/update', param)
                .then((callback) => {
                    if (callback?.status !== 200) {
                        toast.error('保存失败');
                    }

                    if (callback?.status == 200) {
                        toast.success('保存成功');
                        setDirtyOfUserRoles(false);
                    }
                })
                .catch((err) => toast.error(`${err}`))
                .finally(() => {
                    setIsLoading(false);
                    router.refresh();
                });
    };


    const topContentOfRole = useMemo(() => {
        if (!arrayUserRoles.length) {
            return null;
        } return (
            <ScrollShadow
                // hideScrollBar
                className="w-full flex py-0.5 px-2 gap-1"
                orientation="horizontal"
            >
                {arrayUserRoles.map((value) => (
                    <Chip key={value}>{roles.find((r) => `${r.id}` === `${value}`)?.name}</Chip>
                ))}
            </ScrollShadow>
        );
    }, [arrayUserRoles.length]);

    useEffect(() => {
        if(userRoles === "all")
            setDirtyOfUserRoles(!arrayEqual(user.assignRoleIds, [...roles.map((u)=>u.id)]));
        else
            setDirtyOfUserRoles(!arrayEqual(user.assignRoleIds, Array.from(userRoles)));
    }, [user.assignRoleIds, userRoles]);

    return (
        <>
            <div className="px-5">                
                <div className="flex justify-start mb-4 pt-4 gap-2">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        机器人
                    </div>
                    <div className="text-sm font-light text-neutral-200">[{robotsCount}]</div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4 md:flex-wrap md:justify-start flex-1">
                    {user.robotUsers?.map((item) => (
                        <RobotBox
                            key={item.id}
                            data={item}
                        />
                    ))}
                </div>
                <div className="flex justify-start mb-4 pt-4 gap-2">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        角色
                    </div>
                    <div className="text-sm font-light text-neutral-200">[{rolesCount}]</div>
                    <Button color="primary" disabled={!dirtyOfUserRoles || isLoading} className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200" onClick={saveModify}>
                            保存修改
                    </Button>
                </div>
                <ListboxWrapper>
                    <Listbox
                        topContent={topContentOfRole}
                        classNames={{
                            base: "max-w-[100%]",
                            list: "max-h-[600px] overflow-scroll",
                        }}
                        defaultSelectedKeys={userRoles}
                        items={roles}
                        label="Assigned to"
                        selectionMode="multiple"
                        onSelectionChange={setUserRoles}
                        variant="flat"
                    >
                        {(item) => (
                            <ListboxItem key={item.id} textValue={item.name||""}>
                                <div className="flex gap-2 items-center">
                                    <AvatarRole role={item} />
                                    <div className="flex flex-col">
                                        <span className="text-small">{item.name}</span>
                                        <span className="text-tiny text-default-400">{item.description}</span>
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