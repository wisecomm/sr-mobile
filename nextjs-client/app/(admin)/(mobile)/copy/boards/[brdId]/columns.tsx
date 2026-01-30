"use client";

import { BoardsBoard } from './types';
import { SOColumnDef } from "so-grid-core";
import { CommonGrid } from "@/components/utils/common-grid";

export const getColumns = (): SOColumnDef<BoardsBoard>[] => [
    {
        field: 'id',
        headerName: '',
        maxWidth: 30,               // 새로 설치 후 지우고 채크박스 사이즈 확인 필요
        // pinned: 'left',
        checkboxSelection: true,
    },
    {
        field: 'boardId',
        headerName: '순번',
        maxWidth: 80,
        sortable: true,
    },
    {
        field: 'title',
        headerName: '제목',
        maxWidth: 300,
        sortable: true,
    },
    {
        field: 'userId',
        headerName: '작성자',
        maxWidth: 120,
        sortable: true,
    },
    {
        field: 'sysInsertDtm',
        headerName: '등록일',
        valueFormatter: CommonGrid.formatDate,
        cellStyle: { textAlign: 'center' },
        maxWidth: 80,
    },

];
