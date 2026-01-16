import { OrderDetail } from "./types";
import { SOColumnDef } from "so-grid-react";
import { CommonGrid } from "@/components/utils/common-grid";

export const getColumns = (): SOColumnDef<OrderDetail>[] => [
    {
        field: 'id',
        headerName: '',
        maxWidth: 30,               // 새로 설치 후 지우고 채크박스 사이즈 확인 필요
        // pinned: 'left',
        checkboxSelection: true,
    },
    {
        field: 'orderId',
        headerName: '주문번호',
        maxWidth: 100,
        sortable: true,
    },
    {
        field: 'custNm',
        headerName: '고객명',
        maxWidth: 130,
        sortable: true,
    },
    {
        field: 'orderNm',
        headerName: '주문명',
        maxWidth: 150,
    },
    {
        field: 'orderStatus',
        headerName: '상태',
        maxWidth: 50,
    },
    {
        field: 'orderAmt',
        headerName: '금액',
        valueFormatter: CommonGrid.formatNumber,
        cellStyle: { textAlign: 'right' },
        maxWidth: 80,
    },
    {
        field: 'orderDate',
        headerName: '주문일시',
        valueFormatter: CommonGrid.formatDate,
        cellStyle: { textAlign: 'center' },
        maxWidth: 80,
    },

];
