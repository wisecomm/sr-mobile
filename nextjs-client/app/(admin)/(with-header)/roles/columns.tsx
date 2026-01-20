"use client";

import { RoleInfo } from "./types";
import { SOColumnDef } from "so-grid-core";

export const getColumns = (): SOColumnDef<RoleInfo>[] => [
    {
        field: 'id',
        headerName: '',
        maxWidth: 30,               // 새로 설치 후 지우고 채크박스 사이즈 확인 필요
        // pinned: 'left',
        checkboxSelection: true,
    },
    {
        field: 'roleId',
        headerName: '권한 아이디',
    },
    {
        field: 'roleName',
        headerName: '이름',
        sortable: true,
    },
    {
        field: 'roleDesc',
        headerName: '비고',
        sortable: true,
    },
    {
        field: 'useYn',
        headerName: '상태',
        sortable: true,
    },
];
