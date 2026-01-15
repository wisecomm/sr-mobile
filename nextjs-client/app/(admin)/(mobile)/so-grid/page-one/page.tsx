"use client";

import React from 'react';
import { SOGrid, SOColumnDef } from 'so-grid-react';
import 'so-grid-react/styles.css';

interface TestData {
    id: number;
    code: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    active: boolean;
}

const INITIAL_ROW_DATA: TestData[] = [
    { id: 1, code: 'ITEM-001', name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 150, active: true },
    { id: 2, code: 'ITEM-002', name: '한글은 aa 12 잘된 ', category: 'Electronics', price: 129.50, stock: 45, active: true },
    { id: 3, code: 'ITEM-003', name: 'HD Monitor', category: 'Electronics', price: 250.00, stock: 20, active: false },
    { id: 4, code: 'ITEM-004', name: 'USB-C Cable', category: 'Accessories', price: 9.99, stock: 500, active: true },
    { id: 5, code: 'ITEM-005', name: 'Laptop Stand', category: 'Accessories', price: 45.00, stock: 80, active: true },
    { id: 6, code: 'ITEM-006', name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 0, active: true },
    { id: 7, code: 'ITEM-007', name: 'Bluetooth Speaker', category: 'Audio', price: 59.99, stock: 30, active: true },
    { id: 8, code: 'ITEM-008', name: 'Noise Cancelling Headphones', category: 'Audio', price: 299.99, stock: 15, active: true },
    { id: 9, code: 'ITEM-009', name: 'Phone Case', category: 'Accessories', price: 15.00, stock: 200, active: true },
    { id: 10, code: 'ITEM-010', name: 'Power Bank', category: 'Accessories', price: 35.00, stock: 60, active: true },
];

const COLUMN_DEFS: SOColumnDef<TestData>[] = [
    { headerName: 'ID', field: 'id', width: 60 },
    { headerName: 'Code', field: 'code', width: 100 },
    { headerName: 'Name', field: 'name', flex: 1 },
    { headerName: 'Category', field: 'category', width: 120 },
    {
        headerName: 'Price',
        field: 'price',
        width: 100,
        valueFormatter: (params) => `$${Number(params.value).toFixed(2)}`
    },
    {
        headerName: 'Stock',
        field: 'stock',
        width: 80,
        cellStyle: (params) => {
            if (params.value === 0) return { color: 'red', fontWeight: 'bold' };
            if (params.value < 20) return { color: 'orange' };
            return null;
        }
    },
    {
        headerName: 'Active',
        field: 'active',
        width: 80,
        cellRenderer: (params) => (
            <div className="flex items-center justify-center h-full">
                <span className={`px-2 py-0.5 text-xs rounded-full ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {params.value ? 'Active' : 'Inactive'}
                </span>
            </div>
        )
    },
];

const DEFAULT_COL_DEF = {
    headerStyle: { textAlign: 'center' as const },
    resizable: true,
};

export default function StockTestPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full p-4 gap-4 bg-gray-50">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Stock Test Grid</h1>
                <div className="text-sm text-gray-500">so-grid-react v0.1.0</div>
            </div>

            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
                <SOGrid
                    className="h-full w-full"
                    rowData={INITIAL_ROW_DATA}
                    columnDefs={COLUMN_DEFS}
                    defaultColDef={DEFAULT_COL_DEF}
                    headerHeight={40}
                    rowHeight={45}
                />
            </div>
        </div>
    );
}
