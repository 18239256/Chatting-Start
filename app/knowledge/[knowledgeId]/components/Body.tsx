'use client';

import { knowledgeFileArrayType } from "@/app/types";
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
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor
  } from "@nextui-org/react";
import React, {useMemo } from "react";

import {PlusIcon} from "./resource/PlusIcon";
import {VerticalDotsIcon} from "./resource/VerticalDotsIcon";
import {ChevronDownIcon} from "./resource/ChevronDownIcon";
import {SearchIcon} from "./resource/SearchIcon";
import {capitalize} from "./utils";
import UploadfileModal from "./UploadfileModal";

const columns = [
    {
      key: "index",
      label: "序号",
      sortable: true,
    },
    {
      key: "fileName",
      label: "文档",
      sortable: true,
    },
    {
      key: "ext",
      label: "类型",
      sortable: true,
    },
  ];
  

interface BodyProps {
    knowledgeName: string;
    files: string[];
}

const Body: React.FC<BodyProps> = ({ knowledgeName="", files = [] }) => {

    const [uploadOpen, setUploadOpen] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "index",
        direction: "ascending",
    });

    const filesArray = useMemo(() =>{
        let ret = [];
        for (let i = 0; i < files.length; i++) {
            ret.push({
                index: i+1,
                fileName: files[i],
                ext: files[i].substring(files[i].lastIndexOf(".")+1),
            })
            
        };
        return ret;
    },[files]);

    const extColorMap: Record<string, ChipProps["color"]>  = {
        pdf: "success",
        docx: "danger",
        doc: "danger",
        txt: "warning",
        pptx: "primary",
    };

    const extsOptions = [
        {name: "pdf", uid: "pdf"},
        {name: "docx", uid: "docx"},
        {name: "doc", uid: "doc"},
        {name: "txt", uid: "txt"},
        {name: "pptx", uid: "pptx"},
    ];

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredFiles = [...filesArray];
        if (hasSearchFilter) {
          filteredFiles = filteredFiles.filter((file) =>
            file.fileName.toLowerCase().includes(filterValue.toLowerCase()),
          );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== extsOptions.length) {
          filteredFiles = filteredFiles.filter((file) =>
            Array.from(statusFilter).includes(file.ext),
          );
        }
        return filteredFiles;
      }, [filesArray, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
    
        return filteredItems.slice(start, end);
      }, [page, filteredItems, rowsPerPage]);

    
      const sortedItems = React.useMemo(() => {
        return [...items].sort((a: knowledgeFileArrayType, b: knowledgeFileArrayType) => {
          const first = a[sortDescriptor.column as keyof knowledgeFileArrayType] as number;
          const second = b[sortDescriptor.column as keyof knowledgeFileArrayType] as number;
          const cmp = first < second ? -1 : first > second ? 1 : 0;
    
          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
      }, [sortDescriptor, items]);

    
    const renderCell = React.useCallback((file: knowledgeFileArrayType, columnKey: React.Key) => {
        const cellValue = file[columnKey as keyof knowledgeFileArrayType];
        switch (columnKey) {
            case "ext":
                return (
                    <Chip className="capitalize" color={extColorMap[file.ext]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            default:
                return cellValue;
        };
    },[]);

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
                        placeholder="搜索文档..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    文件类型
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
                                {extsOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon />} onClick={()=>setUploadOpen(true)}>
                            添加文件
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">共 {filesArray.length} 个文件</span>
                    <label className="flex items-center text-default-400 text-small">
                        每页行数:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small border-0"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        onSearchChange,
        onRowsPerPageChange,
        filesArray.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-4 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "选中所有文件"
                        : `${selectedKeys.size} / ${filteredItems.length} 被选择`}
                </span>
                {pages > 1 ? (<><Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                /> <div className="hidden sm:flex w-[30%] justify-end gap-2">
                        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                            上一页
                        </Button>
                        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                            下一页
                        </Button>
                    </div></>) : ""}
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <>
        <UploadfileModal
                isOpen={uploadOpen}
                onClose={()=>setUploadOpen(false)}
                knowledgeName= {knowledgeName}
            />
        <div className="flex-1 overflow-y-auto px-4">
            <Table 
                aria-label="当前知识库中还没有上传文件!" 
                isHeaderSticky
                isStriped 
                selectionMode="multiple" 
                color="primary"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
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
                <TableBody items={sortedItems} emptyContent={"没有找到文件"}>
                    {(item) => (
                        <TableRow key={item.index}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div></>
    )
}

export default Body;