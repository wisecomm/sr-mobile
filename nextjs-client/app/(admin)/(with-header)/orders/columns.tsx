import { ColumnDef } from "@tanstack/react-table";
import { OrderDetail } from "./types";
import { TextCell, DateCell, NumberCell } from "@/components/data-table/cells";
import { createColumn, createSelectColumn } from "@/components/data-table/column-helper";

export const getColumns = (): ColumnDef<OrderDetail>[] => [
    createSelectColumn(),
    createColumn("orderId", "주문번호", {
        sort: true,
        size: 120,
        cell: ({ row }) => <TextCell value={row.getValue("orderId")} />
    }),
    createColumn("custNm", "고객명", {
        sort: true,
        size: 150,
        cell: ({ row }) => <TextCell value={row.getValue("custNm")} />
    }),
    createColumn("orderNm", "주문명", {
        sort: true,
        size: 200,
        cell: ({ row }) => <TextCell value={row.getValue("orderNm")} />
    }),
    createColumn("orderStatus", "상태", {
        sort: true,
        size: 100,
        cell: ({ row }) => <TextCell value={row.getValue("orderStatus")} />
    }),
    createColumn("orderAmt", "금액", {
        sort: true,
        size: 120,
        cell: ({ row }) => <NumberCell value={row.getValue("orderAmt")} />
    }),
    createColumn("orderDate", "주문일시", {
        sort: true,
        size: 180,
        cell: ({ row }) => <DateCell value={row.getValue("orderDate")} format="datetime" />
    }),
];
