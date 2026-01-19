"use client";

import { UserDetail } from "./types";
import { SOColumnDef } from "so-grid-core";
import { CommonGrid } from "@/components/utils/common-grid";

export const getColumns = (): SOColumnDef<UserDetail>[] => [
    {
        field: 'id',
        headerName: '',
        maxWidth: 30,               // 새로 설치 후 지우고 채크박스 사이즈 확인 필요
        // pinned: 'left',
        checkboxSelection: true,
    },
    {
        field: 'userId',
        headerName: '아이디',
        maxWidth: 100,
        sortable: true,
    },
    {
        field: 'userName',
        headerName: '이름',
        maxWidth: 150,
    },
    {
        field: 'userEmail',
        headerName: '이메일',
        maxWidth: 200,
    },
    {
        field: 'userNick',
        headerName: '닉네임',
        maxWidth: 150,
    },
    {
        field: 'useYn',
        headerName: '사용',
        cellStyle: { textAlign: 'center' },
        maxWidth: 60,
        valueFormatter: ({ value }) => (value === '1' ? 'Y' : 'N'),
    },
    {
        field: 'sysInsertDtm',
        headerName: '등록일',
        valueFormatter: CommonGrid.formatDate,
        cellStyle: { textAlign: 'center' },
        maxWidth: 80,
    },

];
