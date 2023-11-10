'use client';

import { knowledgeFileArrayType } from "@/app/types";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, ChipProps, Chip, Pagination } from "@nextui-org/react";
import React, {useMemo } from "react";

const columns = [
    {
      key: "index",
      label: "序号",
    },
    {
      key: "fileName",
      label: "文档",
    },
    {
      key: "ext",
      label: "类型",
    },
  ];
  

interface BodyProps {
    files: string[]
}

const Body: React.FC<BodyProps> = ({ files = [] }) => {

    const filesArray = useMemo(()=>{
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
    };

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;

    const pages = Math.ceil(filesArray.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filesArray.slice(start, end);
    }, [page, filesArray]);

    
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

    return (
        <div className="flex-1 overflow-y-auto">
            <Table 
                aria-label="当前知识库中还没有上传文件!" 
                isStriped 
                selectionMode="multiple" 
                color="primary"
                bottomContent={
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  }
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={filesArray}>
                    {(item) => (
                        <TableRow key={item.index}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Body;