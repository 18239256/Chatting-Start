'use client';

import { Role, User } from "@prisma/client";
import { Listbox, ListboxItem, Chip, ScrollShadow, Selection } from "@nextui-org/react";
import Avatar from "@/app/components/Avatar";
import { ListboxWrapper } from "./ListboxWrapper";
import { useMemo, useState } from "react";

interface BodyProps {
    role: Role;
    users: User[];
}


const Body: React.FC<BodyProps> = ({ role, users = [] }) => {
    const [values, setValues] = useState<Selection>(new Set(role.assignIds));
    const arrayValues = Array.from(values);

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

    return (
        <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex-1 justify-between overflow-y-auto py-4">
                    用户管理
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