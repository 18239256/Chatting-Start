'use client';

import { Robot, WXContacts } from "@prisma/client";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    Tooltip,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Progress,
    Spinner,
    SelectSection,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import { FullRobotConversationType, contactArrayType } from "@/app/types";
import { SearchIcon } from "@/app/resources/icons/SearchIcon";
import { ChevronDownIcon } from "@/app/resources/icons/ChevronDownIcon";
import DatePicker from "@/app/components/inputs/DatePicker";
import { isExpired } from "./utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiGroup, BiUser } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import RobotSelectItem from "./RobotSelectItem";
import { RiDeleteBinLine, RiMessage3Line } from "react-icons/ri";
import AddIssueMessageForm from "./AddIssueMessageForm";

const columns = [
    {
        key: "index",
        label: "序号",
        sortable: true,
    },
    {
        key: "name",
        label: "名称",
        sortable: true,
    },
    {
        key: "alias",
        label: "别名",
        sortable: true,
    },
    {
        key: "robot",
        label: "AI",
        sortable: true,
    },
    {
        key: "expired",
        label: "到期时间",
        sortable: true,
    },
    {
        key: "actions",
        label: "操作",
        sortable: false,
    },

];

interface WXContactListProps {
    contacts: (WXContacts & { robot: Robot | null })[];
    robotConversations: FullRobotConversationType[];
}

const WXContactList: React.FC<WXContactListProps> = ({
    contacts,
    robotConversations,
}) => {
    const router = useRouter();
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = React.useState(false);

    const contactTypeOptions = [
        { name: "个人", uid: "person" },
        { name: "群聊", uid: "room" },
    ];

    const statusFilterValue = React.useMemo(
        () => {
            if (statusFilter === "all")
                return contactTypeOptions.map((ct) => ct.name).join(", ").replaceAll("_", " ");

            const sfs = Array.from(statusFilter);
            const cts = contactTypeOptions.filter((ct) => sfs.includes(ct.uid));
            return cts.map((ct) => ct.name).join(", ").replaceAll("_", " ");
        },
        [statusFilter]
    );

    const setExpiredDate = async (contact: contactArrayType, newDate: Date) => {
        setIsLoading(true);
        axios.post(`/api/imentries/updatecontact`, {
            id: contact.id,
            expired: newDate,
        }).then((ret) => {
            toast.success('成功更新有效期');
            router.refresh();
        })
            .catch(() => toast.error('出错了!'))
            .finally(() => setIsLoading(false));
    };

    const changedAI = async (keys: Selection | null, contact: contactArrayType) => {
        if (keys == "all") {
            toast.error("只能选择一个机器人");
            return;
        };
        const robotId = keys ? keys.keys().next().value : "diconnect";
        setIsLoading(true);
        axios.post(`/api/imentries/updatecontact`, {
            id: contact.id,
            robotId: robotId,
        }).then((ret) => {
            toast.success('更新AI机器人成功');
            router.refresh();
        })
            .catch(() => toast.error('出错了!'))
            .finally(() => setIsLoading(false));
    };

    const removeContact = async (contact: contactArrayType) => {
        if (!confirm("确认删除选中的项目?")) return;
        setIsLoading(true);
        axios.delete(`/api/imentries/deletecontact`, {
            data:{
                id: contact.id,
            }
        }).then((ret) => {
            toast.success('删除成功!');
            router.refresh();
        })
            .catch(() => toast.error('出错了!'))
            .finally(() => setIsLoading(false));
    };

    function getRobotIdByCon(con: FullRobotConversationType): string | undefined {
        const robotUser = con.users.filter((user) => user.isRobot == true);
        return robotUser[0].robot?.id;
    }


    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "index",
        direction: "ascending",
    });

    const contactsArray = useMemo(() => {
        let ret = [];
        for (let i = 0; i < contacts.length; i++) {
            ret.push({
                id: contacts[i].id,
                index: i + 1,
                name: contacts[i].name,
                alias: contacts[i].alias || "",
                robot: contacts[i].robot,
                expired: contacts[i].expired,
                isRoom: contacts[i].isRoom,
            })

        };
        return ret;
    }, [contacts]);

    const extColorMap: Record<string, ChipProps["color"]> = {
        person: "success",
        room: "danger",
    };


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredContacts = [...contactsArray];
        if (hasSearchFilter) {
            filteredContacts = filteredContacts.filter((contact) =>
                contact.name.toLowerCase().includes(filterValue.toLowerCase())
                || contact.alias?.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== contactTypeOptions.length) {
            filteredContacts = filteredContacts.filter((contact) =>
                Array.from(statusFilter).includes(contact.isRoom ? "room" : "person"),
            );
        }
        return filteredContacts;
    }, [contactsArray, filterValue, statusFilter, contactTypeOptions, hasSearchFilter]);

    const pages = React.useMemo(() => {
        return Math.ceil(filteredItems.length / rowsPerPage);
    }, [filteredItems, rowsPerPage]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: contactArrayType, b: contactArrayType) => {
            const first = a[sortDescriptor.column as keyof contactArrayType] as number;
            const second = b[sortDescriptor.column as keyof contactArrayType] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((contact: contactArrayType, columnKey: React.Key) => {
        const cellValue = contact[columnKey as keyof contactArrayType];
        switch (columnKey) {
            case "name":
                return (
                    <div className="flex flex-row gap-1">
                        {contact.isRoom ? (<BiGroup size={24} />) : (<BiUser size={24} />)}
                        <Chip className="capitalize" size="sm" variant="flat">
                            {cellValue?.toString()}
                        </Chip>
                    </div>
                );
            case "robot":
                return (
                    <div className="flex flex-row items-center gap-1">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    variant="bordered" color={contact.robot ? "success" : "danger"}
                                >
                                    {contact.robot ? contact.robot.name : "没有AI服务"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                variant="faded"
                                aria-label="robot selection"
                                selectionMode="single"
                                selectedKeys={new Set([contact.robot?.id!])}
                                onSelectionChange={(keys) => changedAI(keys, contact)}>
                                {robotConversations.map((con) => (
                                    <DropdownItem key={getRobotIdByCon(con)} className="capitalize">
                                        <RobotSelectItem data={con} />
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {contact.robot && <Tooltip className=" text-sky-800" content="取消">
                            <span className="text-lg text-sky-800 cursor-pointer active:opacity-50"
                                onClick={() => changedAI(null, contact)}>
                                <TiDelete />
                            </span>
                        </Tooltip>}
                    </div>
                );
            case "expired":
                return (
                    <DatePicker
                        selected={cellValue as Date}
                        onChange={(newDate) => setExpiredDate(contact, newDate!)}
                        placeholderText="选择日期"
                        isClearable
                        warning={isExpired(cellValue as Date)}
                        success={!isExpired(cellValue as Date)}
                    />
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Popover showArrow placement="left" backdrop="opaque">
                            <PopoverTrigger>
                                <span className="text-lg text-primary cursor-pointer active:opacity-50">
                                    <RiMessage3Line />
                                </span>
                            </PopoverTrigger>
                            <PopoverContent className="p-1">
                                <AddIssueMessageForm contact={contact} />
                            </PopoverContent>
                        </Popover>
                        <Tooltip color="danger" content="删除">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => removeContact(contact)} >
                                <RiDeleteBinLine />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue?.toString();
        };
    }, [extColorMap]);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <>
                <div className="flex flex-col gap-4 pt-4 ">
                    <div className="flex justify-between gap-3 items-stretch">
                        <Input
                            isClearable
                            classNames={{
                                label: "text-black/50 dark:text-white/90",
                                input: [
                                    "bg-transparent",
                                    "border-0",
                                    "text-black/90 dark:text-white/90",
                                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                    "focus:ring-0",
                                ],
                                innerWrapper: "bg-transparent",
                                inputWrapper: [
                                    "shadow-xl",
                                    "bg-default-200/50",
                                    "dark:bg-default/60",
                                    "backdrop-blur-xl",
                                    "backdrop-saturate-200",
                                    "hover:bg-default-200/70",
                                    "dark:hover:bg-default/70",
                                    "group-data-[focused=true]:bg-default-200/50",
                                    "dark:group-data-[focused=true]:bg-default/60",
                                    "!cursor-text",
                                    "sm:max-w-[60%]",
                                ],
                            }}
                            variant="flat"
                            placeholder="搜索名称或别名..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                        />
                        <div className="flex gap-3">
                            <Dropdown>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                        {statusFilterValue}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setStatusFilter}
                                >
                                    {contactTypeOptions.map((status) => (
                                        <DropdownItem key={status.uid} className="capitalize">
                                            <div className="flex flex-row items-center">
                                                {status.uid == "person" ? (<BiUser size={20} />) : (<BiGroup size={20} />)}
                                                {status.name}
                                            </div>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-default-400 text-small">共 {contactsArray.length} 个文件</span>
                        <label className="flex items-center text-default-400 text-small">
                            每页行数:
                            <select
                                className="bg-transparent outline-none text-default-400 text-small border-0 focus:ring-0"
                                onChange={onRowsPerPageChange}
                            >
                                <option value="5" selected={rowsPerPage === 5}>5</option>
                                <option value="10" selected={rowsPerPage === 10}>10</option>
                                <option value="15" selected={rowsPerPage === 15}>15</option>
                            </select>
                        </label>
                    </div>
                </div>
            </>
        );
    }, [
        filterValue,
        statusFilter,
        onSearchChange,
        onRowsPerPageChange,
        contactsArray.length,
        hasSearchFilter,
        contactTypeOptions,
        onClear
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-4 flex justify-between items-center">
                <div className="flex">
                    <span className="w-[100%] text-small text-default-400">
                        {selectedKeys === "all"
                            ? "选中所有文件"
                            : `${selectedKeys.size} / ${filteredItems.length} 被选择`}
                    </span>
                </div>
                {Boolean(pages > 1) ? (<>
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={setPage}
                        classNames={{
                            cursor: "bg-sky-500 hover:bg-sky-600"
                        }}
                    /> <div className="hidden sm:flex w-[30%] justify-end gap-2">
                        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                            上一页
                        </Button>
                        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                            下一页
                        </Button>
                    </div></>) : null}
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter, filteredItems.length, onNextPage, onPreviousPage]);

    return (
        <div className="flex-1 overflow-y-auto px-4">
            <Table
                aria-label="没有找到联系人或群聊!"
                isHeaderSticky
                isStriped
                selectionMode="none"
                color="primary"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-full",
                }}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                            align={column.key === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={sortedItems} emptyContent={"没有找到项目"} isLoading={isLoading} loadingContent={<Spinner label="Loading..." />}>
                    {(item) => (
                        <TableRow key={item.index}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default WXContactList;