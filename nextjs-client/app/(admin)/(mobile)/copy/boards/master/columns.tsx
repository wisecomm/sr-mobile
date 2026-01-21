"use client";

import { BoardsMaster } from './types';
import { CommonGrid } from "@/components/utils/common-grid";
import { SOColumnDef } from "so-grid-core";

export const getColumns = (): SOColumnDef<BoardsMaster>[] => [
    {
        field: 'id',
        headerName: '',
        maxWidth: 30,               // 새로 설치 후 지우고 채크박스 사이즈 확인 필요
        // pinned: 'left',
        checkboxSelection: true,
    },
    {
        field: 'brdId',
        headerName: '게시판 코드',
        maxWidth: 120,
        sortable: true,
    },
    {
        field: 'brdNm',
        headerName: '게시판명',
        maxWidth: 120,
    },
    {
        field: 'fileUseYn',
        headerName: '파일첨부',
        maxWidth: 80,
    },
    {
        field: 'fileMaxCnt',
        headerName: '파일 수',
        maxWidth: 80,
    },
    {
        field: 'useYn',
        headerName: '사용',
        maxWidth: 80,
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
