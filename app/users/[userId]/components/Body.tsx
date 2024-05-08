'use client';

import { Knowledge, RobotTemplate, Role, User } from "@prisma/client";
import RobotBox from "./RobotBox";
import { Key, useEffect, useMemo, useState } from "react";
import { FullUserType } from "@/app/types";
import { ListboxWrapper } from "@/app/components/lists/ListboxWrapper";
import { Button, Chip, Listbox, ListboxItem, ScrollShadow, Selection, Tab, Tabs } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AvatarRole from "@/app/components/AvatarRole";
import Tools from "@/app/libs/tools"
import RobotChatModal from "@/app/robots/components/RobotChatModal";

interface BodyProps {
    user: User & { robotUsers: FullUserType[], assignRole: Role[] },
    roles: Role[],
    knowledges: Knowledge[],    
    robotTmpls: RobotTemplate[],
}

const Body: React.FC<BodyProps> = ({ user, roles, knowledges, robotTmpls }) => {
    const [robotsCount, setRobotsCount] = useState(user.robotUsers.length);
    const [rolesCount, setRolesCount] = useState(user.assignRole.length);    
    const [isRobotModalOpen, setIsRobotModalOpen] = useState(false);
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
            assignRoleIds: dirtyOfUserRoles ? (userRoles === "all" ? [...roles.map((u) => u.id)] : arrayUserRoles) : null,
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
        if (userRoles === "all")
            setDirtyOfUserRoles(!Tools.ArrayEqual(user.assignRoleIds, [...roles.map((u) => u.id)]));
        else
            setDirtyOfUserRoles(!Tools.ArrayEqual(user.assignRoleIds, Array.from(userRoles)));
    }, [user.assignRoleIds, userRoles]);

    useEffect(() => {
        setRolesCount(user.assignRole.length);
    }, [user.assignRole.length]);

    useEffect(() => {
        setRobotsCount(user.robotUsers.length);
    }, [user.robotUsers.length]);

    return (
        <>
        <RobotChatModal
          ownerUserId={user.id}
          knowledges={knowledges}
          robotTmpls={robotTmpls}
          isOpen={isRobotModalOpen}
          onClose={() => setIsRobotModalOpen(false)}
        />
            <div className="px-5">
                <Tabs aria-label="Options" className="pt-4">
                <Tab key="roles" title={
                        <div className="flex items-center space-x-2">
                            <span>角色</span>
                            <Chip size="sm" variant="faded" className=" text-gray-400">{rolesCount}</Chip>
                        </div>
                    }>
                        <div className="flex justify-end mb-2 gap-2">
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
                                    <ListboxItem key={item.id} textValue={item.name || ""}>
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
                    </Tab>
                    <Tab key="robots" title={
                        <div className="flex items-center space-x-2">
                            <span>机器人</span>
                            <Chip size="sm" variant="faded" className=" text-gray-400">{robotsCount}</Chip>
                        </div>
                    }>
                        <div className="flex justify-end mb-2 gap-2">
                            <Button color="primary" className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200" onClick={() => setIsRobotModalOpen(true)}>
                                创建机器人
                            </Button>
                        </div>
                        <div className="flex flex-col md:flex-row md:gap-4 md:flex-wrap md:justify-start flex-1">
                            {user.robotUsers?.map((item) => (
                                <RobotBox
                                    key={item.id}
                                    data={item}
                                />
                            ))}
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default Body;