'use client';

import { WXContacts, WXIssueMessages } from "@prisma/client";
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
    Spinner,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Badge,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import { FullRobotConversationType, contactArrayType, wxMessageArrayType } from "@/app/types";
import { SearchIcon } from "@/app/resources/icons/SearchIcon";
import { ChevronDownIcon } from "@/app/resources/icons/ChevronDownIcon";
import DatePicker from "@/app/components/inputs/DatePicker";
import { isExpired } from "./utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiGroup, BiUser } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { PlusIcon } from "@/app/knowledge/[knowledgeId]/components/resource/PlusIcon";
import WXCreateGroupSendingModal from "./WXCreateGroupSendingModal";

const columns = [
    {
        key: "index",
        label: "序号",
        sortable: true,
    },
    {
        key: "contact_name",
        label: "接收者",
        sortable: true,
    },
    {
        key: "content",
        label: "内容",
        sortable: false,
    },
    {
        key: "createdAt",
        label: "创建时间",
        sortable: true,
    },
    {
        key: "issuedAt",
        label: "计划发送时间",
        sortable: true,
    },
    {
        key: "actions",
        label: "操作",
        sortable: false,
    },

];

interface WXMessageLogsProps {
    messages: (WXIssueMessages & {recipient: WXContacts})[] | null;
}

const WXMessageLogs: React.FC<WXMessageLogsProps> = ({
    messages,
}) => {
    const router = useRouter();
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [contactTypeFilter, setContactTypeFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const contactTypeOptions = [
        { name: "个人", uid: "person" },
        { name: "群聊", uid: "room" },
    ];

    const statusFilterValue = React.useMemo(
        () => {
            if (contactTypeFilter === "all")
                return contactTypeOptions.map((ct) => ct.name).join(" ").replaceAll("_", " ");

            const sfs = Array.from(contactTypeFilter);
            const cts = contactTypeOptions.filter((ct) => sfs.includes(ct.uid));
            return cts.map((ct) => ct.name).join(" | ").replaceAll("_", " ");
        },
        [contactTypeFilter]
    );

    const setIssuedDate = async (message: wxMessageArrayType, newDate: Date) => {
        setIsLoading(true);
        axios.post(`/api/imentries/updatecontact`, {
            id: message.id,
            expired: newDate,
        }).then((ret) => {
            toast.success('成功更新有效期');
            router.refresh();
        })
            .catch(() => toast.error('出错了!'))
            .finally(() => setIsLoading(false));
    };

    const removeMessage = async (message: wxMessageArrayType) => {
        if (!confirm("确认删除选中的消息?")) return;
        setIsLoading(true);
        axios.delete(`/api/imentries/deletecontact`, {
            data:{
                id: message.id,
            }
        }).then((ret) => {
            toast.success('删除成功!');
            router.refresh();
        })
            .catch(() => toast.error('出错了!'))
            .finally(() => setIsLoading(false));
    };

    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "index",
        direction: "ascending",
    });

    const messagesArray = useMemo(() => {
        let ret:any[] = [];
        if(messages === null) return ret;
        for (let i = 0; i < messages.length; i++) {
            ret.push({
                id: messages[i].id,
                index: i + 1,
                message: messages[i].message,
                filename: messages[i].fileName,
                isTextMessage: messages[i].isTextMessage,
                deliveried: messages[i].deliveried,
                createdAt: messages[i].createdAt,
                deliveryAt: messages[i].deliveryAt,
                issuedAt: messages[i].issuedAt,
                contact_name: messages[i].recipient.name,
                contact_alias: messages[i].recipient.alias,
                contact_isRoom: messages[i].recipient.isRoom,
                contact_createdAt: messages[i].recipient.createdAt,
            })
        };
        return ret;
    }, [messages]);

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredmessages = [...messagesArray];
        if (hasSearchFilter) {
            filteredmessages = filteredmessages.filter((msg) =>
                msg.message.toLowerCase().includes(filterValue.toLowerCase())
                || msg.filename?.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (contactTypeFilter !== "all" && Array.from(contactTypeFilter).length !== contactTypeOptions.length) {
            filteredmessages = filteredmessages.filter((msg) =>
                Array.from(contactTypeFilter).includes(msg.contact_isRoom ? "room" : "person"),
            );
        }
        return filteredmessages;
    }, [messagesArray, filterValue, contactTypeFilter,contactTypeOptions, hasSearchFilter]);

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

    const renderCell = React.useCallback((message: wxMessageArrayType, columnKey: React.Key) => {
        const cellValue = message[columnKey as keyof wxMessageArrayType];
        switch (columnKey) {
            case "contact_name":
                return (
                    <div className="flex flex-row gap-1 items-center">
                        {message.contact_isRoom ? (<BiGroup size={24} />) : (<BiUser size={24} />)}
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <Chip className="capitalize" size="sm" variant="flat">
                                {message.contact_name}
                            </Chip>
                            <h4 className="text-xs leading-none text-default-300">
                                {message.contact_alias}
                            </h4>
                        </div>
                    </div>
                );
            case "createdAt":
                return (
                    <div className="text-small leading-none text-default-500">
                        {message.createdAt.toLocaleString()}
                    </div>
                );
            case "issuedAt":
                return (
                    <DatePicker
                        selected={cellValue as Date}
                        onChange={(newDate) => setIssuedDate(message, newDate!)}
                        placeholderText="选择日期"
                        warning={isExpired(cellValue as Date)}
                        success={!isExpired(cellValue as Date)}
                    />
                ); 
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="删除">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => removeMessage(message)} >
                                <RiDeleteBinLine />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue?.toString();
        };
    }, []);

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
                                    selectedKeys={contactTypeFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setContactTypeFilter}
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
                            <Button color="primary" className="bg-sky-500" endContent={<PlusIcon />} onClick={() => setIsCreateModalOpen(true) }>
                                新建群发
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-default-400 text-small">共 {messagesArray.length} 个未群发记录</span> 
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
        contactTypeFilter,
        onSearchChange,
        onRowsPerPageChange,
        messagesArray.length,
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
        <div className="flex-1 overflow-y-auto">
            <WXCreateGroupSendingModal
                    curUser={null}
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
            />
            <Table
                aria-label="没有找到联系人或群聊!"
                isHeaderSticky
                isStriped
                selectionMode="none"
                color="primary"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-full overflow-visible",
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

export default WXMessageLogs;