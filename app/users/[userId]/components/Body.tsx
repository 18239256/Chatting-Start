'use client';

import { Knowledge, RobotTemplate, Role, User } from "@prisma/client";
import RobotBox from "./RobotBox";
import { useEffect, useMemo, useState } from "react";
import { FullUserType } from "@/app/types";
import { ListboxWrapper } from "@/app/components/lists/ListboxWrapper";
import { Button, Chip, Listbox, ListboxItem, ScrollShadow, Select, SelectItem, Selection, Tab, Tabs } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AvatarRole from "@/app/components/AvatarRole";
import Tools from "@/app/libs/tools"
import RobotChatModal from "@/app/robots/components/RobotChatModal";
import KnowBody from "@/app/knowledge/[knowledgeId]/components/Body";
import { HiBookOpen } from "react-icons/hi2";
import KnowledgeModal from "@/app/knowledge/components/KnowledgeModal";
import DelKnowConfirmModal from "@/app/knowledge/[knowledgeId]/components/ConfirmModal";

interface BodyProps {
    user: User & { robotUsers: FullUserType[], assignRole: Role[] },
    roles: Role[],
    knowledges: Knowledge[],
    robotTmpls: RobotTemplate[],
}

const Body: React.FC<BodyProps> = ({ user, roles, knowledges, robotTmpls }) => {
    const [robotsCount, setRobotsCount] = useState(user.robotUsers.length);
    const [rolesCount, setRolesCount] = useState(user.assignRole.length);
    const [knowledgesCount, setKnowledgesCount] = useState(knowledges.length);
    const [isRobotModalOpen, setIsRobotModalOpen] = useState(false);
    const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
    const [isKnowledgeDelConfirmOpen, setIsKnowledgeDelConfirmOpen] = useState(false);
    const [userRoles, setUserRoles] = useState<Selection>(new Set(user.assignRoleIds));
    const arrayUserRoles = Array.from(userRoles);
    const [dirtyOfUserRoles, setDirtyOfUserRoles] = useState(false);
    const [knowledgeSelection, setKnowledgeSelection] = useState<Selection>(new Set([]));
    const [knowledgeSelObj, setKnowledgeSelObj] = useState<Knowledge>();
    const [knowledgeFileList, setKnowledgeFileList] = useState<string[]>([]);
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

    // 知识库变更，重新查新知识库中的文件列表
    useEffect(() => {
        setIsLoading(true);
        const selectedKnowledgeId = Array.from(knowledgeSelection)[0];
        axios.post('/api/knowledges/getknowledgefilelist', { knowledgeId: selectedKnowledgeId })
            .then((callback) => {
                if (callback?.status !== 200) {
                    toast.error('查询失败');
                }

                if (callback?.status == 200) {
                    setKnowledgeFileList(callback.data);
                    setKnowledgeSelObj(knowledges.find(k => k.id == selectedKnowledgeId));
                }
            })
            .catch((err) => toast.error(`${err}`))
            .finally(() => {
                setIsLoading(false);
            });
    }, [knowledgeSelection]);

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

    useEffect(() => {
        setKnowledgesCount(knowledges.length);
    }, [knowledges.length]);

    return (
        <>
            <RobotChatModal
                ownerUserId={user.id}
                knowledges={knowledges}
                robotTmpls={robotTmpls}
                isOpen={isRobotModalOpen}
                onClose={() => setIsRobotModalOpen(false)}
            />
            <KnowledgeModal
                curUser={user}
                isOpen={isKnowledgeModalOpen}
                onClose={() => setIsKnowledgeModalOpen(false)}
            />
            {knowledgeSelObj &&
            <DelKnowConfirmModal
                knowledge={knowledgeSelObj}
                isOpen={isKnowledgeDelConfirmOpen}
                onClose={() => setIsKnowledgeDelConfirmOpen(false)}
            />}
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
                    <Tab key="knowledges" title={
                        <div className="flex items-center space-x-2">
                            <span>知识库</span>
                            <Chip size="sm" variant="faded" className=" text-gray-400">{knowledgesCount}</Chip>
                        </div>
                    }>
                        <div className="flex justify-between mb-2 gap-2">
                            <Select
                                items={knowledges}
                                placeholder="选择一个知识库"
                                labelPlacement="outside"
                                startContent={<HiBookOpen color="gray" size={20} />}
                                selectedKeys={knowledgeSelection}
                                onSelectionChange={setKnowledgeSelection}
                                className="max-w-xs">
                                {(know) => (
                                    <SelectItem key={know.id} textValue={know.displayName}>
                                        <div className="flex gap-2 items-center">
                                            <HiBookOpen color="gray" size={20} />
                                            <div className="flex flex-col">
                                                <span className="text-small">{know.displayName}</span>
                                                <span className="text-tiny text-default-400">{know.description}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                )
                                }
                            </Select>
                            <div className="flex gap-2">
                                <Button color="primary" className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200" onClick={() => setIsKnowledgeModalOpen(true)}>
                                    创建知识库
                                </Button>
                                <Button color={!knowledgeSelObj?"default":"danger"}onClick={() => setIsKnowledgeDelConfirmOpen(true)} disabled={!knowledgeSelObj}>
                                    删除知识库
                                </Button>
                            </div>
                        </div>
                        {knowledgeSelObj && <KnowBody knowledge={knowledgeSelObj} files={knowledgeFileList} />}
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default Body;